package fi.oph.akt;

import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import java.time.LocalDate;

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
    translator.setAssured(true);

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
    authorisation.setFromLang("FI");
    authorisation.setToLang("EN");
    authorisation.setTermBeginDate(LocalDate.now());
    authorisation.setTermEndDate(LocalDate.now().plusYears(1));
    authorisation.setPermissionToPublish(true);
    authorisation.setDiaryNumber("12345");

    return authorisation;
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

  public static AuthorisationTermReminder authorisationTermReminder(
    final Authorisation authorisation,
    final Email email
  ) {
    final AuthorisationTermReminder reminder = new AuthorisationTermReminder();
    authorisation.getReminders().add(reminder);

    reminder.setAuthorisation(authorisation);
    reminder.setEmail(email);

    return reminder;
  }
}
