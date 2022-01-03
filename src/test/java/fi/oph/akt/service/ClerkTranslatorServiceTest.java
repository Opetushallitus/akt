package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.ClerkLanguagePairDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorAuthorisationDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.onr.OnrServiceMock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

		IntStream.range(0, 3).forEach(n -> {
			final Translator translator = Factory.translator();
			final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
			final LanguagePair languagePair = Factory.languagePair(authorisation);
			final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

			entityManager.persist(translator);
			entityManager.persist(authorisation);
			entityManager.persist(languagePair);
			entityManager.persist(authorisationTerm);
		});

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		List<ClerkTranslatorDTO> translators = responseDTO.translators();

		assertEquals(3, translators.size());
	}

	@Test
	public void listShouldReturnDistinctFromAndToLangs() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair1 = Factory.languagePair(authorisation);
		final LanguagePair languagePair2 = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		languagePair1.setFromLang("sv");
		languagePair1.setToLang("de");
		languagePair2.setFromLang("fi");
		languagePair2.setToLang("de");

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair1);
		entityManager.persist(languagePair2);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		List<String> fromLangs = responseDTO.langs().from();
		List<String> toLangs = responseDTO.langs().to();

		assertEquals(2, fromLangs.size());
		assertEquals("fi", fromLangs.get(0));
		assertEquals("sv", fromLangs.get(1));

		assertEquals(1, toLangs.size());
		assertEquals("de", toLangs.get(0));
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithAUTBasis() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair1 = Factory.languagePair(authorisation);
		final LanguagePair languagePair2 = Factory.languagePair(authorisation);
		final LanguagePair languagePair3 = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		LocalDate termBeginDate = LocalDate.parse("2022-01-01");
		LocalDate termEndDate = LocalDate.parse("2024-12-31");

		authorisation.setBasis(AuthorisationBasis.AUT);
		languagePair1.setFromLang("sv");
		languagePair1.setToLang("de");
		languagePair1.setPermissionToPublish(true);
		languagePair2.setFromLang("de");
		languagePair2.setToLang("fi");
		languagePair2.setPermissionToPublish(true);
		languagePair3.setFromLang("fi");
		languagePair3.setToLang("sv");
		languagePair3.setPermissionToPublish(false);
		authorisationTerm.setBeginDate(termBeginDate);
		authorisationTerm.setEndDate(termEndDate);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair1);
		entityManager.persist(languagePair2);
		entityManager.persist(languagePair3);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		List<ClerkTranslatorDTO> translatorDTOS = responseDTO.translators();

		assertEquals(1, translatorDTOS.size());

		ClerkTranslatorDTO translatorDTO = translatorDTOS.get(0);
		List<ClerkTranslatorAuthorisationDTO> authorisationDTOS = translatorDTO.authorisations();

		assertEquals(1, authorisationDTOS.size());

		ClerkTranslatorAuthorisationDTO authorisationDTO = authorisationDTOS.get(0);

		assertEquals(AuthorisationBasis.AUT, authorisationDTO.basis());
		assertEquals(termBeginDate, authorisationDTO.term().beginDate());
		assertEquals(termEndDate, authorisationDTO.term().endDate());

		List<ClerkLanguagePairDTO> languagePairDTOS = authorisationDTO.languagePairs();

		assertEquals(3, languagePairDTOS.size());

		// @formatter:off
		Optional<ClerkLanguagePairDTO> langPair1 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals("sv") && lpDTO.to().equals("de") && lpDTO.permissionToPublish())
				.findFirst();

		Optional<ClerkLanguagePairDTO> langPair2 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals("de") && lpDTO.to().equals("fi") && lpDTO.permissionToPublish())
				.findFirst();

		Optional<ClerkLanguagePairDTO> langPair3 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals("fi") && lpDTO.to().equals("sv") && !lpDTO.permissionToPublish())
				.findFirst();
		// @formatter:on

		assertTrue(langPair1.isPresent());
		assertTrue(langPair2.isPresent());
		assertTrue(langPair3.isPresent());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithKKTBasis() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		LocalDate termBeginDate = LocalDate.parse("2022-01-01");
		LocalDate termEndDate = LocalDate.parse("2024-12-31");

		authorisation.setBasis(AuthorisationBasis.KKT);
		authorisation.setAutDate(null);
		authorisation.setKktCheck("kkt-check");
		authorisationTerm.setBeginDate(termBeginDate);
		authorisationTerm.setEndDate(termEndDate);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

		assertEquals(AuthorisationBasis.KKT, authorisationDTO.basis());
		assertEquals(termBeginDate, authorisationDTO.term().beginDate());
		assertEquals(termEndDate, authorisationDTO.term().endDate());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithVIRBasisWithoutTermEndDate() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		LocalDate termBeginDate = LocalDate.parse("2022-01-01");

		authorisation.setBasis(AuthorisationBasis.VIR);
		authorisation.setAutDate(null);
		authorisation.setVirDate(termBeginDate.minusYears(1));
		authorisationTerm.setBeginDate(termBeginDate);
		authorisationTerm.setEndDate(null);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

		assertEquals(AuthorisationBasis.VIR, authorisationDTO.basis());
		assertEquals(termBeginDate, authorisationDTO.term().beginDate());
		assertNull(authorisationDTO.term().endDate());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithVIRBasisWithoutTerm() {
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, null);
		final LanguagePair languagePair = Factory.languagePair(authorisation);

		authorisation.setBasis(AuthorisationBasis.VIR);
		authorisation.setAutDate(null);
		authorisation.setVirDate(LocalDate.now());
		authorisation.setAssuranceDate(null);

		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

		assertNull(authorisationDTO.term());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithMultipleAuthorisations() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();

		meetingDate.setDate(LocalDate.parse("2015-01-01"));

		final Authorisation authorisation1 = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair1 = Factory.languagePair(authorisation1);
		final AuthorisationTerm authorisationTerm1 = Factory.authorisationTerm(authorisation1);

		LocalDate term1BeginDate = meetingDate.getDate();
		LocalDate term1EndDate = term1BeginDate.plusYears(3);

		authorisation1.setBasis(AuthorisationBasis.AUT);
		languagePair1.setFromLang("ru");
		languagePair1.setToLang("fi");
		authorisationTerm1.setBeginDate(term1BeginDate);
		authorisationTerm1.setEndDate(term1EndDate);

		final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair2 = Factory.languagePair(authorisation2);
		final AuthorisationTerm authorisationTerm2 = Factory.authorisationTerm(authorisation2);

		LocalDate term2BeginDate = term1EndDate.plusYears(1);
		LocalDate term2EndDate = term2BeginDate.plusYears(3);

		authorisation2.setBasis(AuthorisationBasis.KKT);
		authorisation2.setAutDate(null);
		authorisation2.setKktCheck("kkt-check");
		languagePair2.setFromLang("fi");
		languagePair2.setToLang("en");
		authorisationTerm2.setBeginDate(term2BeginDate);
		authorisationTerm2.setEndDate(term2EndDate);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation1);
		entityManager.persist(languagePair1);
		entityManager.persist(authorisationTerm1);
		entityManager.persist(authorisation2);
		entityManager.persist(languagePair2);
		entityManager.persist(authorisationTerm2);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		List<ClerkTranslatorAuthorisationDTO> authorisationDTOS = responseDTO.translators().get(0).authorisations();

		assertEquals(2, authorisationDTOS.size());

		ClerkTranslatorAuthorisationDTO autAuthorisationDTO = authorisationDTOS.stream()
				.filter(dto -> dto.basis().equals(AuthorisationBasis.AUT)).toList().get(0);

		ClerkTranslatorAuthorisationDTO kktAuthorisationDTO = authorisationDTOS.stream()
				.filter(dto -> dto.basis().equals(AuthorisationBasis.KKT)).toList().get(0);

		assertEquals(term1BeginDate, autAuthorisationDTO.term().beginDate());
		assertEquals(term1EndDate, autAuthorisationDTO.term().endDate());
		assertEquals("ru", autAuthorisationDTO.languagePairs().get(0).from());
		assertEquals("fi", autAuthorisationDTO.languagePairs().get(0).to());

		assertEquals(term2BeginDate, kktAuthorisationDTO.term().beginDate());
		assertEquals(term2EndDate, kktAuthorisationDTO.term().endDate());
		assertEquals("fi", kktAuthorisationDTO.languagePairs().get(0).from());
		assertEquals("en", kktAuthorisationDTO.languagePairs().get(0).to());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithMultipleAuthorisationTerms() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm1 = Factory.authorisationTerm(authorisation);
		final AuthorisationTerm authorisationTerm2 = Factory.authorisationTerm(authorisation);
		final AuthorisationTerm authorisationTerm3 = Factory.authorisationTerm(authorisation);

		LocalDate term1BeginDate = meetingDate.getDate();
		LocalDate term1EndDate = term1BeginDate.plusYears(1);
		LocalDate term2BeginDate = term1EndDate.plusMonths(1);
		LocalDate term2EndDate = term2BeginDate.plusYears(1);
		LocalDate term3BeginDate = term2EndDate.plusMonths(1);
		LocalDate term3EndDate = term3BeginDate.plusYears(1);

		authorisationTerm1.setBeginDate(term1BeginDate);
		authorisationTerm1.setEndDate(term1EndDate);
		authorisationTerm2.setBeginDate(term2BeginDate);
		authorisationTerm2.setEndDate(term2EndDate);
		authorisationTerm3.setBeginDate(term3BeginDate);
		authorisationTerm3.setEndDate(term3EndDate);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm1);
		entityManager.persist(authorisationTerm2);
		entityManager.persist(authorisationTerm3);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

		assertEquals(term3BeginDate, authorisationDTO.term().beginDate());
		assertEquals(term3EndDate, authorisationDTO.term().endDate());
	}

}
