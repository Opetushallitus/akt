package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairListDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.PublicTranslatorListDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import fi.oph.akt.onr.OnrServiceMock;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@Import({ PublicTranslatorService.class, OnrServiceMock.class })
class PublicTranslatorServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private PublicTranslatorService publicTranslatorService;

	@Test
	public void getListDTOShouldReturnTranslatorsWithActiveTermAndHavingLanguagePairsWithPermissionToBePublished() {
		createVariousTranslators();

		final PublicTranslatorListDTO publicTranslatorListDTO = publicTranslatorService.getListDTO();
		final List<PublicTranslatorDTO> translators = publicTranslatorListDTO.translators();

		assertEquals(3, translators.size());
	}

	@Test
	public void getListDTOShouldReturnDistinctFromAndToLanguages() {
		createVariousTranslators();

		final PublicTranslatorListDTO publicTranslatorListDTO = publicTranslatorService.getListDTO();
		final LanguagePairListDTO langs = publicTranslatorListDTO.langs();

		assertEquals(List.of("fi"), langs.from());
		assertEquals(List.of("en"), langs.to());
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
