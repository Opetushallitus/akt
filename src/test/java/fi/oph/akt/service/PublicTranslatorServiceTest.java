package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.PublicTranslatorResponseDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Import({ PublicTranslatorService.class })
class PublicTranslatorServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private PublicTranslatorService publicTranslatorService;

	@Test
	public void listTranslatorsShouldReturnTranslatorsWithActiveTermAndHavingLanguagePairsWithPermissionToBePublished() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		createVariousTranslators(meetingDate);

		final PublicTranslatorResponseDTO responseDTO = publicTranslatorService.listTranslators();
		final List<PublicTranslatorDTO> translators = responseDTO.translators();

		assertEquals(3, translators.size());
		assertEquals(List.of("Etu0", "Etu1", "Etu2"),
				translators.stream().map(PublicTranslatorDTO::firstName).toList());
		assertEquals(List.of("Suku0", "Suku1", "Suku2"),
				translators.stream().map(PublicTranslatorDTO::lastName).toList());
		assertEquals(List.of("Kaupunki0", "Kaupunki1", "Kaupunki2"),
				translators.stream().map(PublicTranslatorDTO::town).toList());
		assertEquals(List.of("Maa0", "Maa1", "Maa2"), translators.stream().map(PublicTranslatorDTO::country).toList());
	}

	@Test
	public void listTranslatorsShouldReturnDistinctFromAndToLanguages() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		createVariousTranslators(meetingDate);

		final PublicTranslatorResponseDTO responseDTO = publicTranslatorService.listTranslators();
		final LanguagePairsDictDTO languagePairsDictDTO = responseDTO.langs();

		assertEquals(List.of("FI"), languagePairsDictDTO.from());
		assertEquals(List.of("EN"), languagePairsDictDTO.to());
	}

	private void createVariousTranslators(final MeetingDate meetingDate) {
		int i = 0;
		// Term active
		createTranslator(meetingDate, LocalDate.now(), LocalDate.now().plusDays(1), true, i++);

		// Term active
		createTranslator(meetingDate, LocalDate.now().minusDays(1), LocalDate.now(), true, i++);

		// Term active (no end date)
		createTranslator(meetingDate, LocalDate.now(), null, true, i++);

		// Term active but no permission given
		createTranslator(meetingDate, LocalDate.now().minusDays(10), LocalDate.now().plusDays(10), false, i++);

		// Term ended
		createTranslator(meetingDate, LocalDate.now().minusDays(10), LocalDate.now().minusDays(1), true, i++);

		// Term in future
		createTranslator(meetingDate, LocalDate.now().plusDays(1), LocalDate.now().plusDays(10), true, i++);

		// Term in future (no end date)
		createTranslator(meetingDate, LocalDate.now().plusDays(1), null, true, i++);
	}

	private void createTranslator(final MeetingDate meetingDate, final LocalDate beginDate, final LocalDate endDate,
			final boolean permissionToPublish, final int i) {

		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

		final LanguagePair languagePair = Factory.languagePair(authorisation);
		languagePair.setFromLang("FI");
		languagePair.setToLang("EN");
		languagePair.setPermissionToPublish(permissionToPublish);

		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);
		authorisationTerm.setBeginDate(beginDate);
		authorisationTerm.setEndDate(endDate);

		translator.setFirstName("Etu" + i);
		translator.setLastName("Suku" + i);
		translator.setTown("Kaupunki" + i);
		translator.setCountry("Maa" + i);

		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);
	}

}
