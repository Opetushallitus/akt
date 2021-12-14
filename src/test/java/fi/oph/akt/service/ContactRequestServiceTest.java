package fi.oph.akt.service;

import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.TranslatorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@Import({ ContactRequestService.class })
class ContactRequestServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private ContactRequestService contactRequestService;

	@Autowired
	private ContactRequestTranslatorRepository contactRequestTranslatorRepository;

	@Autowired
	private TranslatorRepository translatorRepository;

	@Test
	public void createContactRequestShouldSaveValidRequest() {
		createTranslators(3);
		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds);

		ContactRequest contactRequest = contactRequestService.createContactRequest(contactRequestDTO);
		List<ContactRequestTranslator> contactRequestTranslators = contactRequestTranslatorRepository.findAll();

		assertEquals(contactRequestDTO.firstName(), contactRequest.getFirstName());
		assertEquals(contactRequestDTO.lastName(), contactRequest.getLastName());
		assertEquals(contactRequestDTO.email(), contactRequest.getEmail());
		assertEquals(contactRequestDTO.phoneNumber(), contactRequest.getPhoneNumber());
		assertEquals(contactRequestDTO.message(), contactRequest.getMessage());

		assertEquals(3, contactRequestTranslators.size());

		contactRequestTranslators.forEach(ctr -> {
			assertEquals(ctr.getContactRequest().getId(), contactRequest.getId());
		});

		assertEquals(contactRequestTranslators.stream().map(ContactRequestTranslator::getTranslator)
				.map(Translator::getId).sorted().toList(), translatorIds.stream().sorted().toList());
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingTranslatorIds() {
		List<Long> translatorIds = List.of(1L);

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds);

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	private void createTranslators(int size) {

		IntStream.range(0, size).forEach(n -> {
			final Translator translator = new Translator();
			translator.setOnrOid(UUID.randomUUID().toString());

			entityManager.persist(translator);
		});
	}

	private ContactRequestDTO createContactRequestDTO(List<Long> translatorIds) {
		// @formatter:off
		return ContactRequestDTO.builder()
				.firstName("Foo")
				.lastName("Bar")
				.email("foo@bar")
				.phoneNumber("+358123")
				.message("lorem ipsum")
				.translatorIds(translatorIds)
				.build();
		// @formatter:on
	}

}
