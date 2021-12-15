package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.TranslatorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.util.List;
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
		initTranslators(3);
		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "en", "de");

		ContactRequest contactRequest = contactRequestService.createContactRequest(contactRequestDTO);
		List<ContactRequestTranslator> contactRequestTranslators = contactRequestTranslatorRepository.findAll();

		assertEquals(contactRequestDTO.firstName(), contactRequest.getFirstName());
		assertEquals(contactRequestDTO.lastName(), contactRequest.getLastName());
		assertEquals(contactRequestDTO.email(), contactRequest.getEmail());
		assertEquals(contactRequestDTO.phoneNumber(), contactRequest.getPhoneNumber());
		assertEquals(contactRequestDTO.message(), contactRequest.getMessage());
		assertEquals(contactRequestDTO.fromLang(), contactRequest.getFromLang());
		assertEquals(contactRequestDTO.toLang(), contactRequest.getToLang());

		assertEquals(3, contactRequestTranslators.size());

		contactRequestTranslators.forEach(ctr -> {
			assertEquals(contactRequest.getId(), ctr.getContactRequest().getId());
		});

		assertEquals(translatorIds.stream().sorted().toList(), contactRequestTranslators.stream()
				.map(ContactRequestTranslator::getTranslator).map(Translator::getId).sorted().toList());
	}

	@Test
	public void createContactRequestShouldSaveValidRequestWithDuplicateTranslatorIds() {
		initTranslators(2);
		final long translatorId = translatorRepository.findAll().get(0).getId();
		List<Long> translatorIds = List.of(translatorId, translatorId);

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "en", "de");

		ContactRequest contactRequest = contactRequestService.createContactRequest(contactRequestDTO);
		List<ContactRequestTranslator> contactRequestTranslators = contactRequestTranslatorRepository.findAll();

		assertEquals(contactRequestDTO.message(), contactRequest.getMessage());

		assertEquals(1, contactRequestTranslators.size());

		ContactRequestTranslator ctr = contactRequestTranslators.get(0);

		assertEquals(contactRequest.getId(), ctr.getContactRequest().getId());
		assertEquals(translatorId, ctr.getTranslator().getId());
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingTranslatorIds() {
		initTranslators(1);
		List<Long> translatorIds = List.of(0L);

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "en", "de");

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingFromLang() {
		initTranslators(1);
		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "fi", "de");

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingToLang() {
		initTranslators(1);
		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "en", "sv");

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	private void initTranslators(int size) {

		IntStream.range(0, size).forEach(n -> {
			final Translator translator = Factory.translator();
			final MeetingDate meetingDate = Factory.meetingDate();
			final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
			final LanguagePair languagePair = Factory.languagePair(authorisation);

			languagePair.setFromLang("en");
			languagePair.setToLang("de");

			entityManager.persist(translator);
			entityManager.persist(meetingDate);
			entityManager.persist(authorisation);
			entityManager.persist(languagePair);
		});
	}

	private ContactRequestDTO createContactRequestDTO(List<Long> translatorIds, String fromLang, String toLang) {
		// @formatter:off
		return ContactRequestDTO.builder()
				.firstName("Foo")
				.lastName("Bar")
				.email("foo@bar")
				.phoneNumber("+358123")
				.message("lorem ipsum")
				.fromLang(fromLang)
				.toLang(toLang)
				.translatorIds(translatorIds)
				.build();
		// @formatter:on
	}

}
