package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.ClerkTranslatorDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import java.time.LocalDate;
import java.util.List;

import fi.oph.akt.onr.OnrServiceMock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Import({ ClerkTranslatorService.class, OnrServiceMock.class })
class ClerkTranslatorServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private ClerkTranslatorService clerkTranslatorService;

	@Test
	public void listShouldReturnAllTranslators() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		createVariousTranslators(meetingDate);

		final List<ClerkTranslatorDTO> clerkTranslatorDTOS = clerkTranslatorService.list();

		assertEquals(7, clerkTranslatorDTOS.size());
	}

	private void createVariousTranslators(MeetingDate meetingDate) {
		// Term active
		createTranslator(meetingDate, LocalDate.now(), LocalDate.now().plusDays(1), true);

		// Term active
		createTranslator(meetingDate, LocalDate.now().minusDays(1), LocalDate.now(), true);

		// Term active (no end date)
		createTranslator(meetingDate, LocalDate.now(), null, true);

		// Term active but no permission given
		createTranslator(meetingDate, LocalDate.now().minusDays(10), LocalDate.now().plusDays(10), false);

		// Term ended
		createTranslator(meetingDate, LocalDate.now().minusDays(10), LocalDate.now().minusDays(1), true);

		// Term in future
		createTranslator(meetingDate, LocalDate.now().plusDays(1), LocalDate.now().plusDays(10), true);

		// Term in future (no end date)
		createTranslator(meetingDate, LocalDate.now().plusDays(1), null, true);
	}

	private void createTranslator(final MeetingDate meetingDate, final LocalDate beginDate, final LocalDate endDate,
			final boolean permissionToPublish) {

		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

		final LanguagePair languagePair = Factory.languagePair(authorisation);
		languagePair.setFromLang("fi");
		languagePair.setToLang("en");
		languagePair.setPermissionToPublish(permissionToPublish);

		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);
		authorisationTerm.setBeginDate(beginDate);
		authorisationTerm.setEndDate(endDate);

		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);
	}

}
