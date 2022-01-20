package fi.oph.akt.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.translator.ContactRequestDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.ContactRequestRepository;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.service.email.EmailData;
import fi.oph.akt.service.email.EmailService;
import fi.oph.akt.util.TemplateRenderer;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import javax.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;

@DataJpaTest
class ContactRequestServiceTest {

  public static final String FROM_LANG = "DE";

  public static final String TO_LANG = "SV";

  private ContactRequestService contactRequestService;

  @Resource
  private AuthorisationRepository authorisationRepository;

  @Resource
  private ContactRequestRepository contactRequestRepository;

  @Resource
  private ContactRequestTranslatorRepository contactRequestTranslatorRepository;

  @MockBean
  private EmailService emailService;

  @MockBean
  private TemplateRenderer templateRenderer;

  @Resource
  private TranslatorRepository translatorRepository;

  @Resource
  private TestEntityManager entityManager;

  @Captor
  private ArgumentCaptor<EmailData> emailDataCaptor;

  @BeforeEach
  public void setup() {
    when(templateRenderer.renderContactRequestEmailBody(any())).thenReturn("hello world");

    contactRequestService =
      new ContactRequestService(
        authorisationRepository,
        contactRequestRepository,
        contactRequestTranslatorRepository,
        emailService,
        templateRenderer,
        translatorRepository
      );
  }

  @Test
  public void createContactRequestShouldSaveValidRequest() {
    final MeetingDate meetingDate = createMeetingDate();
    final List<Translator> translators = initTranslators(meetingDate, 3);

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translators, FROM_LANG, TO_LANG);

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

    assertEquals(
      translators.stream().map(Translator::getId).collect(Collectors.toSet()),
      contactRequestTranslators
        .stream()
        .map(ContactRequestTranslator::getTranslator)
        .map(Translator::getId)
        .collect(Collectors.toSet())
    );
  }

  @Test
  public void createContactRequestShouldSaveEmailsToBeSent() {
    final MeetingDate meetingDate = createMeetingDate();
    final List<Translator> translators = initTranslators(meetingDate, 2);

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translators, FROM_LANG, TO_LANG);

    contactRequestService.createContactRequest(contactRequestDTO);

    verify(emailService, times(3)).saveEmail(any(), emailDataCaptor.capture());

    final List<EmailData> emailDatas = emailDataCaptor.getAllValues();

    assertEquals(3, emailDatas.size()); // 2 + 1 copy to foo@bar

    translators.forEach(t ->
      assertEquals(
        1,
        emailDatas
          .stream()
          .filter(e -> e.recipientName().equals(t.getFullName()) && e.recipientAddress().equals(t.getEmail()))
          .count()
      )
    );

    assertEquals(
      1,
      emailDatas
        .stream()
        .filter(e -> e.recipientName().equals("Foo Bar") && e.recipientAddress().equals("foo@bar"))
        .count()
    );

    emailDatas.forEach(emailData -> {
      assertEquals("Yhteydenotto kääntäjärekisteristä", emailData.subject());
      assertEquals("hello world", emailData.body());
    });
  }

  @Test
  public void createContactRequestShouldSaveValidRequestWithDuplicateTranslatorIds() {
    final MeetingDate meetingDate = createMeetingDate();
    final List<Translator> translators = initTranslators(meetingDate, 1);

    final List<Translator> duplicateTranslators = List.of(translators.get(0), translators.get(0));

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(duplicateTranslators, FROM_LANG, TO_LANG);

    final ContactRequest contactRequest = contactRequestService.createContactRequest(contactRequestDTO);
    final List<ContactRequestTranslator> contactRequestTranslators = contactRequestTranslatorRepository.findAll();

    assertEquals(contactRequestDTO.message(), contactRequest.getMessage());

    assertEquals(1, contactRequestTranslators.size());

    final ContactRequestTranslator ctr = contactRequestTranslators.get(0);

    assertEquals(contactRequest.getId(), ctr.getContactRequest().getId());
    assertEquals(translators.get(0).getId(), ctr.getTranslator().getId());
  }

  @Test
  public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingTranslatorIds() {
    final Translator translator = Factory.translator();
    translator.setId(0L);

    final List<Translator> translators = List.of(translator);

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translators, FROM_LANG, TO_LANG);

    assertThrows(IllegalArgumentException.class, () -> contactRequestService.createContactRequest(contactRequestDTO));
  }

  @Test
  public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingFromLang() {
    final MeetingDate meetingDate = createMeetingDate();
    final List<Translator> translators = initTranslators(meetingDate, 1);

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translators, "xx", TO_LANG);

    assertThrows(IllegalArgumentException.class, () -> contactRequestService.createContactRequest(contactRequestDTO));
  }

  @Test
  public void createContactRequestShouldThrowIllegalArgumentExceptionForNonExistingToLang() {
    final MeetingDate meetingDate = createMeetingDate();
    final List<Translator> translators = initTranslators(meetingDate, 1);

    final ContactRequestDTO contactRequestDTO = createContactRequestDTO(translators, FROM_LANG, "xx");

    assertThrows(IllegalArgumentException.class, () -> contactRequestService.createContactRequest(contactRequestDTO));
  }

  private MeetingDate createMeetingDate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    return meetingDate;
  }

  private List<Translator> initTranslators(MeetingDate meetingDate, int size) {
    List<Translator> translators = new ArrayList<>();

    IntStream
      .range(0, size)
      .forEach(i -> {
        final Translator translator = Factory.translator();
        translator.setFirstName("Etu" + i);
        translator.setLastName("Suku" + i);
        translator.setEmail("etu.suku" + i + "@invalid");

        final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
        authorisation.setFromLang(FROM_LANG);
        authorisation.setToLang(TO_LANG);

        entityManager.persist(translator);
        entityManager.persist(authorisation);

        translators.add(translator);
      });

    return translators;
  }

  private ContactRequestDTO createContactRequestDTO(List<Translator> translators, String fromLang, String toLang) {
    return ContactRequestDTO
      .builder()
      .firstName("Foo")
      .lastName("Bar")
      .email("foo@bar")
      .phoneNumber("+358123")
      .message("lorem ipsum")
      .fromLang(fromLang)
      .toLang(toLang)
      .translatorIds(translators.stream().map(Translator::getId).toList())
      .build();
  }
}
