package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.AuthorisationTermDTO;
import fi.oph.akt.api.dto.clerk.ClerkLanguagePairDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorAuthorisationDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorContactDetailsDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class ClerkTranslatorServiceTest {

	private static final String FI = "FI";

	private static final String DE = "DE";

	private static final String EN = "EN";

	private static final String SV = "SV";

	private static final String RU = "RU";

	private ClerkTranslatorService clerkTranslatorService;

	@Resource
	private AuthorisationRepository authorisationRepository;

	@Resource
	private AuthorisationTermRepository authorisationTermRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	private MeetingDateRepository meetingDateRepository;

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private TestEntityManager entityManager;

	@BeforeEach
	public void setup() {
		clerkTranslatorService = new ClerkTranslatorService(authorisationRepository, authorisationTermRepository,
				languagePairRepository, meetingDateRepository, translatorRepository);
	}

	@Test
	public void listShouldReturnAllTranslators() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		final List<String> identityNumbers = Arrays.asList(null, "123", "999888777666");
		final List<String> firstNames = List.of("Etu0", "Etu1", "Etu2");
		final List<String> lastNames = List.of("Suku0", "Suku1", "Suku2");
		final List<String> emails = Arrays.asList("email0", "email1", null);
		final List<String> phoneNumbers = Arrays.asList("phone0", null, "phone2");
		final List<String> streets = Arrays.asList(null, "katu1", "katu2");
		final List<String> postalCodes = Arrays.asList("Postinumero0", "Postinumero1", null);
		final List<String> towns = Arrays.asList(null, "Kaupunki1", "Kaupunki2");
		final List<String> countries = Arrays.asList("Suomi", null, "Maa2");

		IntStream.range(0, 3).forEach(i -> {
			final Translator translator = Factory.translator();
			translator.setIdentityNumber(identityNumbers.get(i));
			translator.setFirstName(firstNames.get(i));
			translator.setLastName(lastNames.get(i));
			translator.setEmail(emails.get(i));
			translator.setPhone(phoneNumbers.get(i));
			translator.setStreet(streets.get(i));
			translator.setPostalCode(postalCodes.get(i));
			translator.setTown(towns.get(i));
			translator.setCountry(countries.get(i));

			final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
			final LanguagePair languagePair = Factory.languagePair(authorisation);
			final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

			entityManager.persist(translator);
			entityManager.persist(authorisation);
			entityManager.persist(languagePair);
			entityManager.persist(authorisationTerm);
		});

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		final List<ClerkTranslatorDTO> translators = responseDTO.translators();

		assertEquals(3, translators.size());
		assertContactDetailsField(identityNumbers, translators, ClerkTranslatorContactDetailsDTO::identityNumber);
		assertContactDetailsField(firstNames, translators, ClerkTranslatorContactDetailsDTO::firstName);
		assertContactDetailsField(lastNames, translators, ClerkTranslatorContactDetailsDTO::lastName);
		assertContactDetailsField(emails, translators, ClerkTranslatorContactDetailsDTO::email);
		assertContactDetailsField(phoneNumbers, translators, ClerkTranslatorContactDetailsDTO::phoneNumber);
		assertContactDetailsField(streets, translators, ClerkTranslatorContactDetailsDTO::street);
		assertContactDetailsField(postalCodes, translators, ClerkTranslatorContactDetailsDTO::postalCode);
		assertContactDetailsField(towns, translators, ClerkTranslatorContactDetailsDTO::town);
		assertContactDetailsField(countries, translators, ClerkTranslatorContactDetailsDTO::country);
	}

	private void assertContactDetailsField(final List<String> expected, final List<ClerkTranslatorDTO> translators,
			final Function<ClerkTranslatorContactDetailsDTO, String> contactDetailsFieldGetter) {

		assertEquals(expected,
				translators.stream().map(ClerkTranslatorDTO::contactDetails).map(contactDetailsFieldGetter).toList());
	}

	@Test
	public void listShouldReturnAllMeetingDates() {
		final MeetingDate meetingDate1 = Factory.meetingDate();
		final MeetingDate meetingDate2 = Factory.meetingDate();

		meetingDate1.setDate(LocalDate.parse("2020-01-01"));
		meetingDate2.setDate(LocalDate.parse("2020-10-06"));

		entityManager.persist(meetingDate1);
		entityManager.persist(meetingDate2);

		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate1);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		entityManager.persist(meetingDate1);
		entityManager.persist(meetingDate2);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		final List<MeetingDateDTO> meetingDateDTOS = responseDTO.meetingDates();
		assertEquals(2, meetingDateDTOS.size());

		assertEquals(meetingDate2.getId(), meetingDateDTOS.get(0).id());
		assertEquals(meetingDate2.getDate(), meetingDateDTOS.get(0).date());
		assertEquals(meetingDate1.getId(), meetingDateDTOS.get(1).id());
		assertEquals(meetingDate1.getDate(), meetingDateDTOS.get(1).date());
	}

	@Test
	public void listShouldReturnDistinctTowns() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		final List<String> towns = Arrays.asList(null, "Kaupunki1", null, "Kaupunki2", "Kaupunki1", null, "Kaupunki2",
				"Kaupunki1");

		IntStream.range(0, towns.size()).forEach(i -> {
			final Translator translator = Factory.translator();
			translator.setTown(towns.get(i));

			final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
			final LanguagePair languagePair = Factory.languagePair(authorisation);
			final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

			entityManager.persist(translator);
			entityManager.persist(authorisation);
			entityManager.persist(languagePair);
			entityManager.persist(authorisationTerm);
		});

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		assertEquals(List.of("Kaupunki1", "Kaupunki2"), responseDTO.towns());
	}

	@Test
	public void listShouldReturnDistinctFromAndToLangs() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair1 = Factory.languagePair(authorisation);
		final LanguagePair languagePair2 = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		languagePair1.setFromLang(SV);
		languagePair1.setToLang(DE);
		languagePair2.setFromLang(FI);
		languagePair2.setToLang(DE);

		entityManager.persist(meetingDate);
		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair1);
		entityManager.persist(languagePair2);
		entityManager.persist(authorisationTerm);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		final List<String> fromLangs = responseDTO.langs().from();
		final List<String> toLangs = responseDTO.langs().to();

		assertEquals(2, fromLangs.size());
		assertEquals(FI, fromLangs.get(0));
		assertEquals(SV, fromLangs.get(1));

		assertEquals(1, toLangs.size());
		assertEquals(DE, toLangs.get(0));
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

		final LocalDate termBeginDate = LocalDate.parse("2022-01-01");
		final LocalDate termEndDate = LocalDate.parse("2024-12-31");

		meetingDate.setDate(LocalDate.parse("2021-11-15"));
		authorisation.setBasis(AuthorisationBasis.AUT);
		authorisation.setAutDate(LocalDate.parse("2021-12-31"));
		authorisation.setAssuranceDate(LocalDate.parse("2021-12-01"));
		languagePair1.setFromLang(SV);
		languagePair1.setToLang(DE);
		languagePair1.setPermissionToPublish(true);
		languagePair2.setFromLang(DE);
		languagePair2.setToLang(FI);
		languagePair2.setPermissionToPublish(true);
		languagePair3.setFromLang(FI);
		languagePair3.setToLang(SV);
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

		final List<ClerkTranslatorDTO> translatorDTOS = responseDTO.translators();
		assertEquals(1, translatorDTOS.size());

		final ClerkTranslatorDTO translatorDTO = translatorDTOS.get(0);

		final List<ClerkTranslatorAuthorisationDTO> authorisationDTOS = translatorDTO.authorisations();
		assertEquals(1, authorisationDTOS.size());

		final ClerkTranslatorAuthorisationDTO authorisationDTO = authorisationDTOS.get(0);
		assertEquals(authorisation.getBasis(), authorisationDTO.basis());
		assertEquals(authorisation.getAutDate(), authorisationDTO.autDate());
		assertNull(authorisationDTO.kktCheck());
		assertNull(authorisationDTO.virDate());
		assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
		assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());

		final List<AuthorisationTermDTO> termDTOS = authorisationDTO.terms();
		assertEquals(1, termDTOS.size());

		assertEquals(termBeginDate, termDTOS.get(0).beginDate());
		assertEquals(termEndDate, termDTOS.get(0).endDate());

		final List<ClerkLanguagePairDTO> languagePairDTOS = authorisationDTO.languagePairs();
		assertEquals(3, languagePairDTOS.size());

		// @formatter:off
		final Optional<ClerkLanguagePairDTO> langPair1 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals(SV) && lpDTO.to().equals(DE) && lpDTO.permissionToPublish())
				.findFirst();

		final Optional<ClerkLanguagePairDTO> langPair2 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals(DE) && lpDTO.to().equals(FI) && lpDTO.permissionToPublish())
				.findFirst();

		final Optional<ClerkLanguagePairDTO> langPair3 = languagePairDTOS.stream()
				.filter(lpDTO -> lpDTO.from().equals(FI) && lpDTO.to().equals(SV) && !lpDTO.permissionToPublish())
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

		final LocalDate termBeginDate = LocalDate.parse("2022-01-01");
		final LocalDate termEndDate = LocalDate.parse("2024-12-31");

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

		final ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations()
				.get(0);
		assertEquals(authorisation.getBasis(), authorisationDTO.basis());
		assertNull(authorisationDTO.autDate());
		assertEquals(authorisation.getKktCheck(), authorisationDTO.kktCheck());
		assertNull(authorisationDTO.virDate());
		assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
		assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());

		assertEquals(termBeginDate, authorisationDTO.terms().get(0).beginDate());
		assertEquals(termEndDate, authorisationDTO.terms().get(0).endDate());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithVIRBasisWithoutTermEndDate() {
		final MeetingDate meetingDate = Factory.meetingDate();
		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		final LocalDate termBeginDate = LocalDate.parse("2022-01-01");

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

		final ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations()
				.get(0);
		assertEquals(authorisation.getBasis(), authorisationDTO.basis());
		assertNull(authorisationDTO.autDate());
		assertNull(authorisationDTO.kktCheck());
		assertEquals(authorisation.getVirDate(), authorisationDTO.virDate());
		assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
		assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());

		assertEquals(termBeginDate, authorisationDTO.terms().get(0).beginDate());
		assertNull(authorisationDTO.terms().get(0).endDate());
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

		final ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations()
				.get(0);
		assertEquals(authorisation.getBasis(), authorisationDTO.basis());
		assertNull(authorisationDTO.autDate());
		assertNull(authorisationDTO.kktCheck());
		assertEquals(authorisation.getVirDate(), authorisationDTO.virDate());
		assertNull(authorisationDTO.assuranceDate());
		assertNull(authorisationDTO.meetingDate());

		assertNull(authorisationDTO.terms());
	}

	@Test
	public void listShouldReturnProperDataForTranslatorWithMultipleAuthorisations() {
		final MeetingDate meetingDate1 = Factory.meetingDate();
		final MeetingDate meetingDate2 = Factory.meetingDate();
		final Translator translator = Factory.translator();

		meetingDate1.setDate(LocalDate.parse("2015-01-01"));
		meetingDate2.setDate(LocalDate.parse("2018-06-01"));

		final Authorisation authorisation1 = Factory.authorisation(translator, meetingDate1);
		final LanguagePair languagePair1 = Factory.languagePair(authorisation1);
		final AuthorisationTerm authorisationTerm1 = Factory.authorisationTerm(authorisation1);

		final LocalDate term1BeginDate = meetingDate1.getDate();
		final LocalDate term1EndDate = term1BeginDate.plusYears(3);

		authorisation1.setBasis(AuthorisationBasis.AUT);
		languagePair1.setFromLang(RU);
		languagePair1.setToLang(FI);
		authorisationTerm1.setBeginDate(term1BeginDate);
		authorisationTerm1.setEndDate(term1EndDate);

		final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate2);
		final LanguagePair languagePair2 = Factory.languagePair(authorisation2);
		final AuthorisationTerm authorisationTerm2 = Factory.authorisationTerm(authorisation2);

		final LocalDate term2BeginDate = meetingDate2.getDate();
		final LocalDate term2EndDate = term2BeginDate.plusYears(3);

		authorisation2.setBasis(AuthorisationBasis.KKT);
		authorisation2.setAutDate(null);
		authorisation2.setKktCheck("kkt-check");
		languagePair2.setFromLang(FI);
		languagePair2.setToLang(EN);
		authorisationTerm2.setBeginDate(term2BeginDate);
		authorisationTerm2.setEndDate(term2EndDate);

		entityManager.persist(meetingDate1);
		entityManager.persist(meetingDate2);
		entityManager.persist(translator);
		entityManager.persist(authorisation1);
		entityManager.persist(languagePair1);
		entityManager.persist(authorisationTerm1);
		entityManager.persist(authorisation2);
		entityManager.persist(languagePair2);
		entityManager.persist(authorisationTerm2);

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

		final List<ClerkTranslatorAuthorisationDTO> authorisationDTOS = responseDTO.translators().get(0)
				.authorisations();

		assertEquals(2, authorisationDTOS.size());

		final ClerkTranslatorAuthorisationDTO autAuthorisationDTO = authorisationDTOS.stream()
				.filter(dto -> dto.basis().equals(AuthorisationBasis.AUT)).toList().get(0);

		final ClerkTranslatorAuthorisationDTO kktAuthorisationDTO = authorisationDTOS.stream()
				.filter(dto -> dto.basis().equals(AuthorisationBasis.KKT)).toList().get(0);

		assertEquals(meetingDate1.getDate(), autAuthorisationDTO.meetingDate());
		assertEquals(term1BeginDate, autAuthorisationDTO.terms().get(0).beginDate());
		assertEquals(term1EndDate, autAuthorisationDTO.terms().get(0).endDate());
		assertEquals(RU, autAuthorisationDTO.languagePairs().get(0).from());
		assertEquals(FI, autAuthorisationDTO.languagePairs().get(0).to());

		assertEquals(meetingDate2.getDate(), kktAuthorisationDTO.meetingDate());
		assertEquals(term2BeginDate, kktAuthorisationDTO.terms().get(0).beginDate());
		assertEquals(term2EndDate, kktAuthorisationDTO.terms().get(0).endDate());
		assertEquals(FI, kktAuthorisationDTO.languagePairs().get(0).from());
		assertEquals(EN, kktAuthorisationDTO.languagePairs().get(0).to());
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

		final LocalDate term1BeginDate = meetingDate.getDate();
		final LocalDate term1EndDate = term1BeginDate.plusYears(1);
		final LocalDate term2BeginDate = term1EndDate.plusMonths(1);
		final LocalDate term2EndDate = term2BeginDate.plusYears(1);
		final LocalDate term3BeginDate = term2EndDate.plusMonths(1);
		final LocalDate term3EndDate = term3BeginDate.plusYears(1);

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

		final ClerkTranslatorAuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations()
				.get(0);

		final List<AuthorisationTermDTO> terms = authorisationDTO.terms();
		assertEquals(3, terms.size());

		assertEquals(term3BeginDate, terms.get(0).beginDate());
		assertEquals(term3EndDate, terms.get(0).endDate());
		assertEquals(term2BeginDate, terms.get(1).beginDate());
		assertEquals(term2EndDate, terms.get(1).endDate());
		assertEquals(term1BeginDate, terms.get(2).beginDate());
		assertEquals(term1EndDate, terms.get(2).endDate());
	}

}
