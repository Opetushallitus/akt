package fi.oph.akt.api.search;

import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Import(SearchService.class)
class SearchServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private SearchService searchService;

	@Test
	public void testListAll() {

		createTranslator("listed starts today", true, LocalDate.now(), LocalDate.now().plusDays(1));
		createTranslator("listed ends today", true, LocalDate.now().minusDays(1), LocalDate.now());
		createTranslator("not public", false, LocalDate.now().minusDays(10), LocalDate.now().plusDays(10));
		createTranslator("term passed", true, LocalDate.now().minusDays(10), LocalDate.now().minusDays(1));
		createTranslator("term in future", true, LocalDate.now().plusDays(1), LocalDate.now().plusDays(10));

		final Page<TranslatorDTO> translatorDTOS = searchService.listAll(null);
		assertEquals(2, translatorDTOS.getSize());
		assertEquals(Set.of("listed starts today", "listed ends today"),
				translatorDTOS.stream().map(TranslatorDTO::lastName).collect(Collectors.toSet()));
	}

	private void createTranslator(final String oid, final boolean permissionToPublish, final LocalDate beginDate,
			final LocalDate endDate) {

		final MeetingDate meetingDate = new MeetingDate();
		meetingDate.setDate(LocalDate.now());

		final Translator translator = new Translator();
		translator.setOnrOid(oid);

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
		authorisation.setLanguagePairs(Lists.list(languagePair));

		final AuthorisationTerm term = new AuthorisationTerm();
		term.setAuthorisation(authorisation);
		term.setBeginDate(beginDate);
		term.setEndDate(endDate);
		authorisation.setTerms(Lists.list(term));

		translator.setAuthorisations(Lists.list(authorisation));

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(term);
	}

}