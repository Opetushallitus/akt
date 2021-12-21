package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestRepository;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.service.email.EmailData;
import fi.oph.akt.service.email.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@DataJpaTest
class ContactRequestServiceTest {

	public static final String FROM_LANG = "de";

	public static final String TO_LANG = "sv";

	private ContactRequestService contactRequestService;

	@Resource
	private ContactRequestRepository contactRequestRepository;

	@Resource
	private ContactRequestTranslatorRepository contactRequestTranslatorRepository;

	@MockBean
	private EmailService emailService;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private TestEntityManager entityManager;

	@Captor
	private ArgumentCaptor<EmailData> emailDataCaptor;

	@BeforeEach
	public void setup() {
		contactRequestService = new ContactRequestService(contactRequestRepository, contactRequestTranslatorRepository,
				emailService, languagePairRepository, translatorRepository);
	}

	@Test
	public void createContactRequestShouldSaveValidRequest() {
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 3);

		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, FROM_LANG, TO_LANG);

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

		assertEquals(Set.copyOf(translatorIds), contactRequestTranslators.stream()
				.map(ContactRequestTranslator::getTranslator).map(Translator::getId).collect(Collectors.toSet()));
	}

	@Test
	public void createContactRequestShouldSaveEmailsToBeSentToGivenTranslators() {
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 3);

		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, FROM_LANG, TO_LANG);

		contactRequestService.createContactRequest(contactRequestDTO);

		verify(emailService, times(3)).saveEmail(any(), emailDataCaptor.capture());

		List<EmailData> emailDatas = emailDataCaptor.getAllValues();

		assertEquals(3, emailDatas.size());

		emailDatas.forEach(emailData -> {
			assertEquals("auktoris@oph.fi", emailData.sender());
			assertEquals("Yhteydenotto kääntäjärekisteristä", emailData.subject());
			assertTrue(emailData.body().contains(contactRequestDTO.message()));
		});
	}

	@Test
	public void createContactRequestShouldSaveValidRequestWithDuplicateTranslatorIds() {
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 2);

		final long translatorId = translatorRepository.findAll().get(0).getId();
		List<Long> translatorIds = List.of(translatorId, translatorId);

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, FROM_LANG, TO_LANG);

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
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 1);

		List<Long> translatorIds = List.of(0L);

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, FROM_LANG, TO_LANG);

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingFromLang() {
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 1);

		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, "xx", TO_LANG);

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	@Test
	public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingToLang() {
		MeetingDate meetingDate = createMeetingDate();
		initTranslators(meetingDate, 1);

		List<Long> translatorIds = translatorRepository.findAll().stream().map(Translator::getId).toList();

		final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translatorIds, FROM_LANG, "xx");

		assertThrows(IllegalArgumentException.class,
				() -> contactRequestService.createContactRequest(contactRequestDTO));
	}

	private MeetingDate createMeetingDate() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		return meetingDate;
	}

	private void initTranslators(MeetingDate meetingDate, int size) {

		IntStream.range(0, size).forEach(n -> {
			final Translator translator = Factory.translator();
			final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

			final LanguagePair languagePair = Factory.languagePair(authorisation);
			languagePair.setFromLang(FROM_LANG);
			languagePair.setToLang(TO_LANG);

			entityManager.persist(translator);
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
