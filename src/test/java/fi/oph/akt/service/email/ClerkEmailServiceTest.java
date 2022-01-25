package fi.oph.akt.service.email;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.InformalEmailRequestDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationTermReminderRepository;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.EmailRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.TemplateRenderer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
public class ClerkEmailServiceTest {

  private ClerkEmailService clerkEmailService;

  @MockBean
  private AuthorisationTermReminderRepository authorisationTermReminderRepository;

  @Resource
  private AuthorisationTermRepository authorisationTermRepository;

  @Resource
  private EmailRepository emailRepository;

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
    clerkEmailService =
      new ClerkEmailService(
        authorisationTermReminderRepository,
        authorisationTermRepository,
        emailRepository,
        emailService,
        templateRenderer,
        translatorRepository
      );
  }

  @Test
  public void createInformalEmailsShouldSaveEmailsToGivenTranslators() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    final List<Translator> translators = new ArrayList<>();

    IntStream
      .range(0, 3)
      .forEach(i -> {
        final Translator translator = Factory.translator();
        translator.setFirstName("Etu" + i);
        translator.setLastName("Suku" + i);
        translator.setEmail("etu.suku" + i + "@invalid");

        final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
        final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

        entityManager.persist(translator);
        entityManager.persist(authorisation);
        entityManager.persist(authorisationTerm);

        translators.add(translator);
      });

    final InformalEmailRequestDTO emailRequestDTO = InformalEmailRequestDTO
      .builder()
      .translatorIds(translators.stream().map(Translator::getId).toList())
      .subject("otsikko")
      .body("viesti")
      .build();

    clerkEmailService.createInformalEmails(emailRequestDTO);

    verify(emailService, times(3)).saveEmail(any(), emailDataCaptor.capture());

    final List<EmailData> emailDatas = emailDataCaptor.getAllValues();

    assertEquals(3, emailDatas.size());

    IntStream
      .range(0, 3)
      .forEach(i -> {
        final Translator translator = translators.get(i);
        final EmailData emailData = emailDatas.get(i);

        assertEquals(translator.getFullName(), emailData.recipientName());
        assertEquals(translator.getEmail(), emailData.recipientAddress());
        assertEquals("otsikko", emailData.subject());
        assertEquals("viesti", emailData.body());
      });
  }

  @Test
  public void createInformalEmailsShouldSaveEmailToGivenTranslatorsWithDuplicateTranslatorIds() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisationTerm);

    final Long tId = translatorRepository.findAll().get(0).getId();

    final InformalEmailRequestDTO emailRequestDTO = InformalEmailRequestDTO
      .builder()
      .translatorIds(List.of(tId, tId))
      .subject("otsikko")
      .body("viesti")
      .build();

    clerkEmailService.createInformalEmails(emailRequestDTO);

    verify(emailService).saveEmail(any(), emailDataCaptor.capture());
  }

  @Test
  public void createInformalEmailsShouldThrowIllegalArgumentExceptionForNonExistingTranslatorIds() {
    final InformalEmailRequestDTO emailRequestDTO = InformalEmailRequestDTO
      .builder()
      .translatorIds(List.of(1L))
      .subject("otsikko")
      .body("viesti")
      .build();

    assertThrows(IllegalArgumentException.class, () -> clerkEmailService.createInformalEmails(emailRequestDTO));
  }

  @Test
  public void testCreateAuthorisationExpiryEmail() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

    translator.setFirstName("Etu");
    translator.setLastName("Suku");
    translator.setEmail("etu.suku@invalid");

    authorisation.setFromLang("SV");
    authorisation.setToLang("EN");
    authorisationTerm.setEndDate(LocalDate.parse("2025-12-01"));

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisationTerm);

    final Map<String, Object> expectedTemplateParams = Map.of(
      "expiryDate",
      "01.12.2025",
      "langPair",
      "sv - en",
      "contactEmail",
      "auktoris@oph.fi"
    );

    when(templateRenderer.renderAuthorisationExpiryEmailBody(expectedTemplateParams))
      .thenReturn("Auktorisointisi päättyy 01.12.2025");

    clerkEmailService.createAuthorisationExpiryEmail(authorisationTerm.getId());

    verify(emailService).saveEmail(any(), emailDataCaptor.capture());

    final EmailData emailData = emailDataCaptor.getValue();

    assertEquals("Etu Suku", emailData.recipientName());
    assertEquals("etu.suku@invalid", emailData.recipientAddress());
    assertEquals("Auktorisointisi on päättymässä", emailData.subject());
    assertEquals("Auktorisointisi päättyy 01.12.2025", emailData.body());

    verify(authorisationTermReminderRepository).save(any());
  }
}
