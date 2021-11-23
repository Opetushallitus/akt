package fi.oph.akt.service;

import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.TranslatorDTO;
import fi.oph.akt.config.AuditConfiguration;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.onr.OnrServiceMock;
import java.time.LocalDate;
import java.util.UUID;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Import({ TranslatorService.class, OnrServiceMock.class, AuditConfiguration.class })
class TranslatorServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private TranslatorService translatorService;

	@Test
	public void listTranslatorsTest() {
		createVariousTranslators();

		Pageable pageable = Mockito.mock(Pageable.class);
		Mockito.when(pageable.isUnpaged()).thenReturn(true);

		final Page<TranslatorDTO> translatorDTOS = translatorService.listTranslators(pageable);

		assertEquals(7, translatorDTOS.getSize());
	}

	@Test
	public void listPublicTranslatorsTest() {
		createVariousTranslators();

		final Page<PublicTranslatorDTO> translatorDTOS = translatorService.listPublicTranslators(null);

		assertEquals(3, translatorDTOS.getSize());
	}

	private void createVariousTranslators() {
		// Term active
		createTranslator(LocalDate.now(), LocalDate.now().plusDays(1), true);

		// Term active
		createTranslator(LocalDate.now().minusDays(1), LocalDate.now(), true);

		// Term active (no end date)
		createTranslator(LocalDate.now(), null, true);

		// Term active but no permission given
		createTranslator(LocalDate.now().minusDays(10), LocalDate.now().plusDays(10), false);

		// Term ended
		createTranslator(LocalDate.now().minusDays(10), LocalDate.now().minusDays(1), true);

		// Term in future
		createTranslator(LocalDate.now().plusDays(1), LocalDate.now().plusDays(10), true);

		// Term in future (no end date)
		createTranslator(LocalDate.now().plusDays(1), null, true);
	}

	private void createTranslator(final LocalDate beginDate, final LocalDate endDate,
			final boolean permissionToPublish) {

		final MeetingDate meetingDate = new MeetingDate();
		meetingDate.setDate(LocalDate.now());

		final Translator translator = new Translator();
		translator.setOnrOid(UUID.randomUUID().toString());

		final Authorisation authorisation = new Authorisation();
		authorisation.setTranslator(translator);
		authorisation.setBasis(AuthorisationBasis.AUT);
		authorisation.setAutDate(LocalDate.now());
		authorisation.setAssuranceDate(LocalDate.now());
		authorisation.setMeetingDate(meetingDate);

		final LanguagePair languagePair = new LanguagePair();
		languagePair.setAuthorisation(authorisation);
		languagePair.setFromLang("fi");
		languagePair.setToLang("en");
		languagePair.setPermissionToPublish(permissionToPublish);

		final AuthorisationTerm term = new AuthorisationTerm();
		term.setAuthorisation(authorisation);
		term.setBeginDate(beginDate);
		term.setEndDate(endDate);

		authorisation.setLanguagePairs(Lists.list(languagePair));
		authorisation.setTerms(Lists.list(term));

		translator.setAuthorisations(Lists.list(authorisation));

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(term);
	}

}
