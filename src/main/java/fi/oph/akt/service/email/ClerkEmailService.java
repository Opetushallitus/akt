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
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.TemplateRenderer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
  private final MeetingDateRepository meetingDateRepository;

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

    translators.forEach(translator ->
      Optional
        .ofNullable(translator.getEmail())
        .ifPresent(recipientAddress -> {
          final String recipientName = translator.getFullName();

          createEmail(
            recipientName,
            recipientAddress,
            emailRequestDTO.subject(),
            emailRequestDTO.body(),
            EmailType.INFORMAL
          );
        })
    );
  }

  private Long createEmail(
    final String recipientName,
    final String recipientAddress,
    final String subject,
    final String body,
    final EmailType emailType
  ) {
    final EmailData emailData = EmailData
      .builder()
      .recipientName(recipientName)
      .recipientAddress(recipientAddress)
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
    final Translator translator = translatorRepository.getById(expiryData.translatorId());

    Optional
      .ofNullable(translator.getEmail())
      .ifPresent(recipientAddress -> {
        final Optional<LocalDate> nextMeetingDateOption = meetingDateRepository.findNextMeetingDate();

        final String recipientName = translator.getFullName();

        final String emailSubject = "Auktorisointisi on päättymässä";

        final String emailBody = getAuthorisationExpiryEmailBody(
          translator.getFullName(),
          expiryData.fromLang(),
          expiryData.toLang(),
          authorisationTerm.getEndDate(),
          nextMeetingDateOption
        );

        final Long emailId = createEmail(
          recipientName,
          recipientAddress,
          emailSubject,
          emailBody,
          EmailType.AUTHORISATION_EXPIRY
        );

        final Email email = emailRepository.getById(emailId);

        createAuthorisationTermReminder(authorisationTerm, email);
      });
  }

  private String getAuthorisationExpiryEmailBody(
    final String translatorName,
    final String fromLang,
    final String toLang,
    final LocalDate expiryDate,
    final Optional<LocalDate> nextMeetingDateOption
  ) {
    final String langPair = fromLang.toLowerCase() + " - " + toLang.toLowerCase();
    final String expiry = expiryDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    final String nextMeeting = nextMeetingDateOption
      .map(date -> date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")))
      .orElse("<ei tiedossa>");

    final Map<String, Object> templateParams = Map.of(
      "translatorName",
      translatorName,
      "langPair",
      langPair,
      "expiryDate",
      expiry,
      "nextMeetingDate",
      nextMeeting,
      "contactEmail",
      "auktoris.lautakunta@oph.fi"
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
