package fi.oph.akt.service.email;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import fi.oph.akt.Factory;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationTermRepository;
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
  private AuthorisationTermRepository authorisationTermRepository;

  @MockBean
  private ClerkEmailService clerkEmailService;

  @Resource
  private TestEntityManager entityManager;

  @Captor
  private ArgumentCaptor<Long> longCaptor;

  @BeforeEach
  public void setup() {
    emailCreator = new ExpiringAuthorisationsEmailCreator(authorisationTermRepository, clerkEmailService);
  }

  @Test
  public void testPollExpiringAuthorisations() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    final AuthorisationTerm term1 = createTerm(meetingDate, LocalDate.now(), "t1@invalid");
    final AuthorisationTerm term2 = createTerm(meetingDate, LocalDate.now().plusDays(10), "t2@invalid");
    final AuthorisationTerm term3 = createTerm(meetingDate, LocalDate.now().plusMonths(3), "t3@invalid");

    final AuthorisationTerm pastTerm = createTerm(meetingDate, LocalDate.now().minusDays(1), "t4@invalid");
    final AuthorisationTerm futureTerm = createTerm(
      meetingDate,
      LocalDate.now().plusMonths(3).plusDays(1),
      "t5@invalid"
    );

    final AuthorisationTerm remindedTerm1 = createTerm(meetingDate, LocalDate.now().plusMonths(1), "t6@invalid");
    createAuthorisationTermReminder(remindedTerm1);

    final AuthorisationTerm remindedTerm2 = createTerm(meetingDate, LocalDate.now().plusMonths(2), "t7@invalid");
    createAuthorisationTermReminder(remindedTerm2);
    createAuthorisationTermReminder(remindedTerm2);

    emailCreator.pollExpiringAuthorisations();

    verify(clerkEmailService, times(3)).createAuthorisationExpiryEmail(longCaptor.capture());

    final List<Long> expiringTermIds = longCaptor.getAllValues();

    assertEquals(3, expiringTermIds.size());

    assertTrue(expiringTermIds.contains(term1.getId()));
    assertTrue(expiringTermIds.contains(term2.getId()));
    assertTrue(expiringTermIds.contains(term3.getId()));
  }

  @Test
  public void testPollExpiringAuthorisationsWithTranslatorWithoutEmailAddress() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    createTerm(meetingDate, LocalDate.now(), null);

    emailCreator.pollExpiringAuthorisations();

    verifyNoInteractions(clerkEmailService);
  }

  private AuthorisationTerm createTerm(
    final MeetingDate meetingDate,
    final LocalDate termEndDate,
    final String translatorEmail
  ) {
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

    translator.setEmail(translatorEmail);
    authorisationTerm.setBeginDate(termEndDate.minusYears(1));
    authorisationTerm.setEndDate(termEndDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisationTerm);

    return authorisationTerm;
  }

  private void createAuthorisationTermReminder(final AuthorisationTerm term) {
    final Email email = Factory.email(EmailType.AUTHORISATION_EXPIRY);
    entityManager.persist(email);

    final AuthorisationTermReminder reminder = Factory.authorisationTermReminder(term, email);
    entityManager.persist(reminder);
  }
}
