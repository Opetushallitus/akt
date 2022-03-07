package fi.oph.akt.service.email;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import fi.oph.akt.Factory;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationRepository;
import java.time.LocalDate;
import java.util.List;
import javax.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;

@WithMockUser
@DataJpaTest
public class ExpiringAuthorisationsEmailCreatorTest {

  private ExpiringAuthorisationsEmailCreator emailCreator;

  @Resource
  private AuthorisationRepository authorisationRepository;

  @MockBean
  private ClerkEmailService clerkEmailService;

  @Resource
  private TestEntityManager entityManager;

  @Captor
  private ArgumentCaptor<Long> longCaptor;

  @BeforeEach
  public void setup() {
    emailCreator = new ExpiringAuthorisationsEmailCreator(authorisationRepository, clerkEmailService);
  }

  @Test
  public void testPollExpiringAuthorisations() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    final Authorisation auth1 = createAuthorisation(meetingDate, LocalDate.now(), "t1@invalid");
    final Authorisation auth2 = createAuthorisation(meetingDate, LocalDate.now().plusDays(10), "t2@invalid");
    final Authorisation auth3 = createAuthorisation(meetingDate, LocalDate.now().plusMonths(3), "t3@invalid");

    final Authorisation pastAuth = createAuthorisation(meetingDate, LocalDate.now().minusDays(1), "t4@invalid");
    final Authorisation futureAuth = createAuthorisation(
      meetingDate,
      LocalDate.now().plusMonths(3).plusDays(1),
      "t5@invalid"
    );
    final Authorisation authWithoutTermEndDate = createAuthorisation(meetingDate, null, "t6@invalid");

    final Authorisation remindedAuth1 = createAuthorisation(meetingDate, LocalDate.now().plusMonths(1), "t7@invalid");
    createAuthorisationTermReminder(remindedAuth1);

    final Authorisation remindedAuth2 = createAuthorisation(meetingDate, LocalDate.now().plusMonths(2), "t8@invalid");
    createAuthorisationTermReminder(remindedAuth2);
    createAuthorisationTermReminder(remindedAuth2);

    emailCreator.pollExpiringAuthorisations();

    verify(clerkEmailService, times(3)).createAuthorisationExpiryEmail(longCaptor.capture());

    final List<Long> expiringAuthIds = longCaptor.getAllValues();

    assertEquals(3, expiringAuthIds.size());

    assertTrue(expiringAuthIds.contains(auth1.getId()));
    assertTrue(expiringAuthIds.contains(auth2.getId()));
    assertTrue(expiringAuthIds.contains(auth3.getId()));
  }

  @Test
  public void testPollExpiringAuthorisationsWithTranslatorWithoutEmailAddress() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    createAuthorisation(meetingDate, LocalDate.now(), null);

    emailCreator.pollExpiringAuthorisations();

    verifyNoInteractions(clerkEmailService);
  }

  private Authorisation createAuthorisation(
    final MeetingDate meetingDate,
    final LocalDate termEndDate,
    final String translatorEmail
  ) {
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    translator.setEmail(translatorEmail);
    authorisation.setTermEndDate(termEndDate);

    if (termEndDate != null) {
      authorisation.setTermBeginDate(termEndDate.minusYears(1));
    } else {
      authorisation.setBasis(AuthorisationBasis.VIR);
      authorisation.setTermBeginDate(null);
    }

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    return authorisation;
  }

  private void createAuthorisationTermReminder(final Authorisation authorisation) {
    final Email email = Factory.email(EmailType.AUTHORISATION_EXPIRY);
    entityManager.persist(email);

    final AuthorisationTermReminder reminder = Factory.authorisationTermReminder(authorisation, email);
    entityManager.persist(reminder);
  }
}
