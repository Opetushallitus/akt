package fi.oph.akt;

import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import java.time.LocalDate;
import java.util.UUID;

public class Factory {

  public static MeetingDate meetingDate() {
    return meetingDate(LocalDate.now());
  }

  public static MeetingDate meetingDate(final LocalDate date) {
    final MeetingDate meetingDate = new MeetingDate();
    meetingDate.setDate(date);

    return meetingDate;
  }

  public static Translator translator() {
    final Translator translator = new Translator();
    translator.setFirstName("Foo");
    translator.setLastName("Bar");

    return translator;
  }

  public static Authorisation authorisation(Translator translator, MeetingDate meetingDate) {
    final Authorisation authorisation = new Authorisation();
    translator.getAuthorisations().add(authorisation);
    if (meetingDate != null) {
      meetingDate.getAuthorisations().add(authorisation);
    }

    authorisation.setTranslator(translator);
    authorisation.setMeetingDate(meetingDate);
    authorisation.setBasis(AuthorisationBasis.AUT);
    authorisation.setAutDate(LocalDate.now());
    authorisation.setAssuranceDate(LocalDate.now());
    authorisation.setFromLang("FI");
    authorisation.setToLang("EN");
    authorisation.setPermissionToPublish(true);
    authorisation.setDiaryNumber(UUID.randomUUID().toString());

    return authorisation;
  }

  public static AuthorisationTerm authorisationTerm(Authorisation authorisation) {
    final AuthorisationTerm authorisationTerm = new AuthorisationTerm();
    authorisation.getTerms().add(authorisationTerm);

    authorisationTerm.setAuthorisation(authorisation);
    authorisationTerm.setBeginDate(LocalDate.now());
    authorisationTerm.setEndDate(LocalDate.now().plusYears(1));

    return authorisationTerm;
  }

  public static Email email(final EmailType emailType) {
    final Email email = new Email();
    email.setEmailType(emailType);
    email.setRecipientName("Ville Vastaanottaja");
    email.setRecipientAddress("ville.vastaanottaja@invalid");
    email.setSubject("Otsikko");
    email.setBody("Sisältö on tässä");

    return email;
  }

  public static AuthorisationTermReminder authorisationTermReminder(final AuthorisationTerm term, final Email email) {
    final AuthorisationTermReminder reminder = new AuthorisationTermReminder();
    term.getReminders().add(reminder);

    reminder.setAuthorisationTerm(term);
    reminder.setEmail(email);

    return reminder;
  }
}
