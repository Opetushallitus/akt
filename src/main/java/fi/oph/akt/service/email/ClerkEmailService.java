package fi.oph.akt.service.email;

import fi.oph.akt.api.dto.clerk.InformalEmailRequestDTO;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationExpiryDataProjection;
import fi.oph.akt.repository.AuthorisationTermReminderRepository;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.EmailRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.TemplateRenderer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClerkEmailService {

  @Resource
  private final AuthorisationTermReminderRepository authorisationTermReminderRepository;

  @Resource
  private final AuthorisationTermRepository authorisationTermRepository;

  @Resource
  private final EmailRepository emailRepository;

  @Resource
  private final EmailService emailService;

  @Resource
  private final TemplateRenderer templateRenderer;

  @Resource
  private final TranslatorRepository translatorRepository;

  @Transactional
  public void createInformalEmails(final InformalEmailRequestDTO emailRequestDTO) {
    final List<Long> distinctTranslatorIds = emailRequestDTO.translatorIds().stream().distinct().toList();
    final List<Translator> translators = translatorRepository.findAllById(distinctTranslatorIds);

    if (translators.size() != distinctTranslatorIds.size()) {
      throw new IllegalArgumentException("Each translator by provided translatorIds not found");
    }

    translators.forEach(translator -> {
      // TODO: replace recipient with translator's email address
      createEmail(
        "translator" + translator.getId() + "@test.fi",
        emailRequestDTO.subject(),
        emailRequestDTO.body(),
        EmailType.INFORMAL
      );
    });
  }

  private Long createEmail(final String recipient, final String subject, final String body, final EmailType emailType) {
    final EmailData emailData = EmailData
      .builder()
      .sender("AKT")
      .recipient(recipient)
      .subject(subject)
      .body(body)
      .build();

    return emailService.saveEmail(emailType, emailData);
  }

  @Transactional
  public void createAuthorisationExpiryEmail(final long authorisationTermId) {
    authorisationTermRepository.findById(authorisationTermId).ifPresent(this::createAuthorisationExpiryData);
  }

  private void createAuthorisationExpiryData(final AuthorisationTerm authorisationTerm) {
    final AuthorisationExpiryDataProjection expiryData = authorisationTermRepository.getExpiryDataProjection(
      authorisationTerm.getId()
    );

    final String emailBody = getAuthorisationExpiryEmailBody(
      authorisationTerm.getEndDate(),
      expiryData.fromLang(),
      expiryData.toLang()
    );

    // TODO: replace recipient with translator's email address
    final Long emailId = createEmail(
      "translator" + expiryData.translatorId() + "@test.fi",
      "Auktorisointisi on päättymässä",
      emailBody,
      EmailType.AUTHORISATION_EXPIRY
    );

    final Email email = emailRepository.getById(emailId);

    createAuthorisationTermReminder(authorisationTerm, email);
  }

  private String getAuthorisationExpiryEmailBody(
    final LocalDate termEndDate,
    final String fromLang,
    final String toLang
  ) {
    final Map<String, Object> templateParams = Map.of(
      "expiryDate",
      termEndDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
      "langPair",
      fromLang.toLowerCase() + " - " + toLang.toLowerCase(),
      "contactEmail",
      "auktoris@oph.fi"
    );

    return templateRenderer.renderAuthorisationExpiryEmailBody(templateParams);
  }

  private void createAuthorisationTermReminder(final AuthorisationTerm authorisationTerm, final Email email) {
    final AuthorisationTermReminder reminder = new AuthorisationTermReminder();
    reminder.setAuthorisationTerm(authorisationTerm);
    reminder.setEmail(email);

    authorisationTermReminderRepository.save(reminder);
  }
}
