package fi.oph.akt.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.AuthorisationDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationDTOCommonFields;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationPublishPermissionDTO;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationUpdateDTO;
import fi.oph.akt.api.dto.clerk.modify.TranslatorCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.TranslatorDTOCommonFields;
import fi.oph.akt.api.dto.clerk.modify.TranslatorUpdateDTO;
import fi.oph.akt.audit.AktOperation;
import fi.oph.akt.audit.AuditService;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationBasis;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.AuthorisationTermReminderRepository;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorRepository;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import javax.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;

@WithMockUser
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
  private AuthorisationTermReminderRepository authorisationTermReminderRepository;

  @Resource
  private MeetingDateRepository meetingDateRepository;

  @Resource
  private TranslatorRepository translatorRepository;

  @MockBean
  private AuditService auditService;

  @Resource
  private TestEntityManager entityManager;

  @BeforeEach
  public void setup() {
    final MeetingDateService meetingDateService = new MeetingDateService(meetingDateRepository, auditService);

    clerkTranslatorService =
      new ClerkTranslatorService(
        authorisationRepository,
        authorisationTermReminderRepository,
        meetingDateService,
        meetingDateRepository,
        translatorRepository,
        auditService
      );
  }

  @Test
  public void listShouldReturnAllTranslatorsWithProperFields() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    IntStream
      .range(0, 3)
      .forEach(i -> {
        final Translator translator = Factory.translator();
        final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

        entityManager.persist(translator);
        entityManager.persist(authorisation);
      });

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final List<ClerkTranslatorDTO> translators = responseDTO.translators();

    assertEquals(3, translators.size());

    translators.forEach(clerkTranslatorDTO -> {
      assertEquals(1, clerkTranslatorDTO.authorisations().size());
    });

    verify(auditService).logOperation(AktOperation.LIST_TRANSLATORS);
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void listShouldReturnAllMeetingDates() {
    final MeetingDate meetingDate1 = Factory.meetingDate();
    final MeetingDate meetingDate2 = Factory.meetingDate();

    meetingDate1.setDate(LocalDate.parse("2020-01-01"));
    meetingDate2.setDate(LocalDate.parse("2020-10-06"));

    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate1);

    entityManager.persist(meetingDate1);
    entityManager.persist(meetingDate2);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

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

    final List<String> towns = Arrays.asList(
      null,
      "Kaupunki1",
      null,
      "Kaupunki2",
      "Kaupunki1",
      null,
      "Kaupunki2",
      "Kaupunki1"
    );

    IntStream
      .range(0, towns.size())
      .forEach(i -> {
        final Translator translator = Factory.translator();
        translator.setTown(towns.get(i));

        final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

        entityManager.persist(translator);
        entityManager.persist(authorisation);
      });

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();

    assertEquals(List.of("Kaupunki1", "Kaupunki2"), responseDTO.towns());
  }

  @Test
  public void listShouldReturnDistinctFromAndToLangs() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();

    final Authorisation authorisation1 = Factory.authorisation(translator, meetingDate);
    authorisation1.setFromLang(SV);
    authorisation1.setToLang(DE);

    final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate);
    authorisation2.setFromLang(FI);
    authorisation2.setToLang(DE);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation1);
    entityManager.persist(authorisation2);

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
  public void listShouldReturnProperPersonalDataForTranslators() {
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
    final List<String> extraInformations = Arrays.asList(null, "Nimi muutettu", "???");

    IntStream
      .range(0, 3)
      .forEach(i -> {
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
        translator.setExtraInformation(extraInformations.get(i));

        final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

        entityManager.persist(translator);
        entityManager.persist(authorisation);
      });

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final List<ClerkTranslatorDTO> translators = responseDTO.translators();

    assertEquals(3, translators.size());
    assertTranslatorField(firstNames, translators, ClerkTranslatorDTO::firstName);
    assertTranslatorField(lastNames, translators, ClerkTranslatorDTO::lastName);
    assertTranslatorField(identityNumbers, translators, ClerkTranslatorDTO::identityNumber);
    assertTranslatorField(emails, translators, ClerkTranslatorDTO::email);
    assertTranslatorField(phoneNumbers, translators, ClerkTranslatorDTO::phoneNumber);
    assertTranslatorField(streets, translators, ClerkTranslatorDTO::street);
    assertTranslatorField(postalCodes, translators, ClerkTranslatorDTO::postalCode);
    assertTranslatorField(towns, translators, ClerkTranslatorDTO::town);
    assertTranslatorField(countries, translators, ClerkTranslatorDTO::country);
    assertTranslatorField(extraInformations, translators, ClerkTranslatorDTO::extraInformation);
  }

  private void assertTranslatorField(
    final List<String> expected,
    final List<ClerkTranslatorDTO> translators,
    final Function<ClerkTranslatorDTO, String> getter
  ) {
    assertEquals(expected, translators.stream().map(getter).toList());
  }

  @Test
  public void listShouldReturnProperDataForTranslatorWithAUTBasis() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    authorisation.setBasis(AuthorisationBasis.AUT);
    authorisation.setAutDate(LocalDate.parse("2021-12-31"));
    authorisation.setAssuranceDate(LocalDate.parse("2021-12-01"));

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final AuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

    assertEquals(authorisation.getBasis(), authorisationDTO.basis());
    assertEquals(authorisation.getTermBeginDate(), authorisationDTO.termBeginDate());
    assertEquals(authorisation.getTermEndDate(), authorisationDTO.termEndDate());
    assertEquals(authorisation.getDiaryNumber(), authorisationDTO.diaryNumber());
    assertEquals(authorisation.getAutDate(), authorisationDTO.autDate());
    assertNull(authorisationDTO.kktCheck());
    assertNull(authorisationDTO.virDate());
    assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
    assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());
  }

  @Test
  public void listShouldReturnProperDataForTranslatorWithKKTBasis() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    authorisation.setBasis(AuthorisationBasis.KKT);
    authorisation.setAutDate(null);
    authorisation.setKktCheck("kkt-check");

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final AuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

    assertEquals(authorisation.getBasis(), authorisationDTO.basis());
    assertEquals(authorisation.getTermBeginDate(), authorisationDTO.termBeginDate());
    assertEquals(authorisation.getTermEndDate(), authorisationDTO.termEndDate());
    assertEquals(authorisation.getDiaryNumber(), authorisationDTO.diaryNumber());
    assertNull(authorisationDTO.autDate());
    assertEquals(authorisation.getKktCheck(), authorisationDTO.kktCheck());
    assertNull(authorisationDTO.virDate());
    assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
    assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());
  }

  @Test
  public void listShouldReturnProperDataForTranslatorWithVIRBasis() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    authorisation.setBasis(AuthorisationBasis.VIR);
    authorisation.setTermBeginDate(LocalDate.now().minusYears(1));
    authorisation.setTermEndDate(null);
    authorisation.setAutDate(null);
    authorisation.setVirDate(LocalDate.now().minusYears(2));

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final AuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

    assertEquals(authorisation.getBasis(), authorisationDTO.basis());
    assertEquals(authorisation.getTermBeginDate(), authorisationDTO.termBeginDate());
    assertNull(authorisationDTO.termEndDate());
    assertEquals(authorisation.getDiaryNumber(), authorisationDTO.diaryNumber());
    assertNull(authorisationDTO.autDate());
    assertNull(authorisationDTO.kktCheck());
    assertEquals(authorisation.getVirDate(), authorisationDTO.virDate());
    assertEquals(authorisation.getAssuranceDate(), authorisationDTO.assuranceDate());
    assertEquals(meetingDate.getDate(), authorisationDTO.meetingDate());
  }

  @Test
  public void listShouldReturnProperDataForTranslatorWithFormerVIRBasis() {
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, null);

    authorisation.setBasis(AuthorisationBasis.VIR);
    authorisation.setTermBeginDate(null);
    authorisation.setTermEndDate(null);
    authorisation.setAutDate(null);
    authorisation.setVirDate(LocalDate.now().minusYears(2));
    authorisation.setAssuranceDate(null);

    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final AuthorisationDTO authorisationDTO = responseDTO.translators().get(0).authorisations().get(0);

    assertEquals(authorisation.getBasis(), authorisationDTO.basis());
    assertNull(authorisationDTO.termBeginDate());
    assertNull(authorisationDTO.termEndDate());
    assertEquals(authorisation.getDiaryNumber(), authorisationDTO.diaryNumber());
    assertNull(authorisationDTO.autDate());
    assertNull(authorisationDTO.kktCheck());
    assertEquals(authorisation.getVirDate(), authorisationDTO.virDate());
    assertNull(authorisationDTO.assuranceDate());
    assertNull(authorisationDTO.meetingDate());
  }

  @Test
  public void listShouldReturnProperDataForTranslatorWithMultipleAuthorisations() {
    final MeetingDate meetingDate1 = Factory.meetingDate(LocalDate.of(2015, 1, 1));
    final MeetingDate meetingDate2 = Factory.meetingDate(LocalDate.of(2018, 6, 1));
    final Translator translator = Factory.translator();

    //
    final Authorisation authorisation1 = Factory.authorisation(translator, meetingDate1);
    final LocalDate term1BeginDate = meetingDate1.getDate();
    final LocalDate term1EndDate = term1BeginDate.plusYears(3);

    authorisation1.setBasis(AuthorisationBasis.AUT);
    authorisation1.setTermBeginDate(term1BeginDate);
    authorisation1.setTermEndDate(term1EndDate);
    authorisation1.setFromLang(RU);
    authorisation1.setToLang(FI);
    authorisation1.setPermissionToPublish(true);

    //
    final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate2);
    final LocalDate term2BeginDate = meetingDate2.getDate();
    final LocalDate term2EndDate = term2BeginDate.plusYears(3);

    authorisation2.setBasis(AuthorisationBasis.KKT);
    authorisation2.setAutDate(null);
    authorisation2.setKktCheck("kkt-check");
    authorisation2.setTermBeginDate(term2BeginDate);
    authorisation2.setTermEndDate(term2EndDate);
    authorisation2.setFromLang(FI);
    authorisation2.setToLang(EN);
    authorisation2.setPermissionToPublish(false);

    entityManager.persist(meetingDate1);
    entityManager.persist(meetingDate2);
    entityManager.persist(translator);
    entityManager.persist(authorisation1);
    entityManager.persist(authorisation2);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final List<AuthorisationDTO> authorisationDTOS = responseDTO.translators().get(0).authorisations();

    assertEquals(2, authorisationDTOS.size());

    final AuthorisationDTO autAuthorisationDTO = authorisationDTOS
      .stream()
      .filter(dto -> dto.basis().equals(AuthorisationBasis.AUT))
      .toList()
      .get(0);

    final AuthorisationDTO kktAuthorisationDTO = authorisationDTOS
      .stream()
      .filter(dto -> dto.basis().equals(AuthorisationBasis.KKT))
      .toList()
      .get(0);

    assertEquals(meetingDate1.getDate(), autAuthorisationDTO.meetingDate());
    assertEquals(term1BeginDate, autAuthorisationDTO.termBeginDate());
    assertEquals(term1EndDate, autAuthorisationDTO.termEndDate());
    assertEquals(RU, autAuthorisationDTO.languagePair().from());
    assertEquals(FI, autAuthorisationDTO.languagePair().to());
    assertTrue(autAuthorisationDTO.permissionToPublish());

    assertEquals(meetingDate2.getDate(), kktAuthorisationDTO.meetingDate());
    assertEquals(term2BeginDate, kktAuthorisationDTO.termBeginDate());
    assertEquals(term2EndDate, kktAuthorisationDTO.termEndDate());
    assertEquals(FI, kktAuthorisationDTO.languagePair().from());
    assertEquals(EN, kktAuthorisationDTO.languagePair().to());
    assertFalse(kktAuthorisationDTO.permissionToPublish());
  }

  @Test
  public void listShouldReturnTranslatorsAuthorisationsOrderedByTermBeginDate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();

    final Authorisation authorisation1 = Factory.authorisation(translator, meetingDate);
    authorisation1.setTermBeginDate(LocalDate.now().minusYears(1));

    final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate);
    authorisation2.setTermBeginDate(LocalDate.now());

    final Authorisation authorisation3 = Factory.authorisation(translator, meetingDate);
    authorisation3.setBasis(AuthorisationBasis.VIR);
    authorisation3.setAutDate(null);
    authorisation3.setVirDate(LocalDate.now());
    authorisation3.setTermBeginDate(null);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation1);
    entityManager.persist(authorisation2);
    entityManager.persist(authorisation3);

    final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
    final List<AuthorisationDTO> authorisationDTOS = responseDTO.translators().get(0).authorisations();

    assertEquals(authorisation2.getId(), authorisationDTOS.get(0).id());
    assertEquals(authorisation1.getId(), authorisationDTOS.get(1).id());
    assertEquals(authorisation3.getId(), authorisationDTOS.get(2).id());
  }

  @Test
  public void testTranslatorCreate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    entityManager.persist(meetingDate);

    final AuthorisationCreateDTO expectedAuth = AuthorisationCreateDTO
      .builder()
      .basis(AuthorisationBasis.KKT)
      .kktCheck("checked")
      .assuranceDate(LocalDate.now())
      .meetingDate(meetingDate.getDate())
      .from(FI)
      .to(SV)
      .permissionToPublish(true)
      .termBeginDate(LocalDate.now())
      .termEndDate(LocalDate.now().plusDays(1))
      .diaryNumber("012345")
      .build();
    final TranslatorCreateDTO createDTO = TranslatorCreateDTO
      .builder()
      .identityNumber("aard")
      .firstName("Anne")
      .lastName("Aardvark")
      .email("anne@aardvark.invalid")
      .phoneNumber("555")
      .street("st")
      .town("tw")
      .postalCode("pstl")
      .country("ct")
      .authorisations(List.of(expectedAuth))
      .build();

    final ClerkTranslatorDTO response = clerkTranslatorService.createTranslator(createDTO);

    assertResponseMatchesGet(response);

    assertTranslatorCommonFields(createDTO, response);

    assertEquals(1, response.authorisations().size());
    final AuthorisationDTO authDto = response.authorisations().get(0);
    assertAuthorisationCommonFields(expectedAuth, authDto);

    verify(auditService).logById(AktOperation.CREATE_TRANSLATOR, response.id());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testTranslatorGet() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final ClerkTranslatorDTO clerkTranslatorDTO = clerkTranslatorService.getTranslator(translator.getId());

    assertNotNull(clerkTranslatorDTO);
    assertEquals(translator.getId(), clerkTranslatorDTO.id());

    verify(auditService).logById(AktOperation.GET_TRANSLATOR, translator.getId());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testTranslatorUpdate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final TranslatorUpdateDTO updateDTO = TranslatorUpdateDTO
      .builder()
      .id(translator.getId())
      .version(translator.getVersion())
      .identityNumber("aard")
      .firstName("Anne")
      .lastName("Aardvark")
      .email("anne@aardvark.invalid")
      .phoneNumber("555")
      .street("st")
      .town("tw")
      .postalCode("pstl")
      .country("ct")
      .build();

    final ClerkTranslatorDTO response = clerkTranslatorService.updateTranslator(updateDTO);

    assertResponseMatchesGet(response);

    assertEquals(updateDTO.id(), response.id());
    assertEquals(updateDTO.version() + 1, response.version());
    assertTranslatorCommonFields(updateDTO, response);

    verify(auditService).logById(AktOperation.UPDATE_TRANSLATOR, response.id());
    verifyNoMoreInteractions(auditService);
  }

  private void assertTranslatorCommonFields(final TranslatorDTOCommonFields expected, final ClerkTranslatorDTO dto) {
    assertEquals(expected.identityNumber(), dto.identityNumber());
    assertEquals(expected.firstName(), dto.firstName());
    assertEquals(expected.lastName(), dto.lastName());
    assertEquals(expected.email(), dto.email());
    assertEquals(expected.phoneNumber(), dto.phoneNumber());
    assertEquals(expected.street(), dto.street());
    assertEquals(expected.town(), dto.town());
    assertEquals(expected.postalCode(), dto.postalCode());
    assertEquals(expected.country(), dto.country());
    assertEquals(expected.extraInformation(), dto.extraInformation());
  }

  @Test
  public void testTranslatorDelete() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final Email email = Factory.email(EmailType.AUTHORISATION_EXPIRY);
    final AuthorisationTermReminder authorisationTermReminder = Factory.authorisationTermReminder(authorisation, email);

    final Translator translator2 = Factory.translator();
    final Authorisation authorisation2 = Factory.authorisation(translator2, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(email);
    entityManager.persist(authorisationTermReminder);
    entityManager.persist(translator2);
    entityManager.persist(authorisation2);

    final long translatorId = translator.getId();
    clerkTranslatorService.deleteTranslator(translatorId);

    assertEquals(
      Set.of(translator2.getId()),
      translatorRepository.findAll().stream().map(Translator::getId).collect(Collectors.toSet())
    );

    verify(auditService).logById(AktOperation.DELETE_TRANSLATOR, translatorId);
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testAuthorisationCreate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final AuthorisationCreateDTO createDTO = AuthorisationCreateDTO
      .builder()
      .basis(AuthorisationBasis.KKT)
      .kktCheck("checked")
      .assuranceDate(LocalDate.now())
      .meetingDate(meetingDate.getDate())
      .from(FI)
      .to(SV)
      .permissionToPublish(true)
      .termBeginDate(LocalDate.now())
      .termEndDate(LocalDate.now().plusDays(1))
      .diaryNumber("012345")
      .build();

    final ClerkTranslatorDTO response = clerkTranslatorService.createAuthorisation(translator.getId(), createDTO);

    assertResponseMatchesGet(response);

    assertEquals(2, response.authorisations().size());
    final AuthorisationDTO authorisationDTO = response
      .authorisations()
      .stream()
      .filter(a -> a.id() != authorisation.getId())
      .findAny()
      .orElseThrow();

    assertAuthorisationCommonFields(createDTO, authorisationDTO);

    verify(auditService).logAuthorisation(AktOperation.CREATE_AUTHORISATION, translator, authorisationDTO.id());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testAuthorisationUpdate() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final MeetingDate meetingDate2 = Factory.meetingDate(LocalDate.now().minusDays(1));
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(meetingDate2);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final AuthorisationUpdateDTO updateDTO = AuthorisationUpdateDTO
      .builder()
      .id(authorisation.getId())
      .version(authorisation.getVersion())
      .basis(AuthorisationBasis.KKT)
      .kktCheck("kkt done")
      .assuranceDate(authorisation.getAssuranceDate().minusDays(1))
      .meetingDate(meetingDate2.getDate())
      .from(FI)
      .to(SV)
      .permissionToPublish(!authorisation.isPermissionToPublish())
      .termBeginDate(authorisation.getTermBeginDate().minusDays(1))
      .termEndDate(authorisation.getTermEndDate().plusDays(1))
      .diaryNumber(UUID.randomUUID().toString())
      .build();

    final ClerkTranslatorDTO response = clerkTranslatorService.updateAuthorisation(updateDTO);

    assertResponseMatchesGet(response);

    final AuthorisationDTO authorisationDTO = response.authorisations().get(0);
    assertEquals(updateDTO.id(), authorisationDTO.id());
    assertEquals(updateDTO.version() + 1, authorisationDTO.version());
    assertAuthorisationCommonFields(updateDTO, authorisationDTO);

    verify(auditService).logAuthorisation(AktOperation.UPDATE_AUTHORISATION, translator, authorisationDTO.id());
    verifyNoMoreInteractions(auditService);
  }

  private void assertAuthorisationCommonFields(
    final AuthorisationDTOCommonFields expected,
    final AuthorisationDTO authorisationDTO
  ) {
    assertEquals(expected.basis(), authorisationDTO.basis());
    assertEquals(expected.kktCheck(), authorisationDTO.kktCheck());
    assertEquals(expected.autDate(), authorisationDTO.autDate());
    assertEquals(expected.virDate(), authorisationDTO.virDate());
    assertEquals(expected.assuranceDate(), authorisationDTO.assuranceDate());
    assertEquals(expected.meetingDate(), authorisationDTO.meetingDate());
    assertEquals(expected.from(), authorisationDTO.languagePair().from());
    assertEquals(expected.to(), authorisationDTO.languagePair().to());
    assertEquals(expected.permissionToPublish(), authorisationDTO.permissionToPublish());
    assertEquals(expected.termBeginDate(), authorisationDTO.termBeginDate());
    assertEquals(expected.termEndDate(), authorisationDTO.termEndDate());
    assertEquals(expected.diaryNumber(), authorisationDTO.diaryNumber());
  }

  @Test
  public void testAuthorisationUpdatePublishPermission() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    authorisation.setPermissionToPublish(true);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final AuthorisationPublishPermissionDTO publishPermissionDTO = AuthorisationPublishPermissionDTO
      .builder()
      .id(authorisation.getId())
      .version(authorisation.getVersion())
      .permissionToPublish(false)
      .build();

    final ClerkTranslatorDTO response = clerkTranslatorService.updateAuthorisationPublishPermission(
      publishPermissionDTO
    );

    assertResponseMatchesGet(response);

    final AuthorisationDTO authorisationDTO = response.authorisations().get(0);
    assertEquals(publishPermissionDTO.id(), authorisationDTO.id());
    assertEquals(publishPermissionDTO.version() + 1, authorisationDTO.version());
    assertEquals(false, authorisationDTO.permissionToPublish());

    verify(auditService)
      .logAuthorisation(AktOperation.UPDATE_AUTHORISATION_PUBLISH_PERMISSION, translator, authorisationDTO.id());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testAuthorisationDelete() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final Authorisation authorisation2 = Factory.authorisation(translator, meetingDate);
    final Email email = Factory.email(EmailType.AUTHORISATION_EXPIRY);
    final AuthorisationTermReminder authorisationTermReminder = Factory.authorisationTermReminder(authorisation, email);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisation2);
    entityManager.persist(email);
    entityManager.persist(authorisationTermReminder);

    final long authorisationId = authorisation.getId();
    final ClerkTranslatorDTO response = clerkTranslatorService.deleteAuthorisation(authorisationId);

    assertResponseMatchesGet(response);

    assertEquals(
      Set.of(authorisation2.getId()),
      response.authorisations().stream().map(AuthorisationDTO::id).collect(Collectors.toSet())
    );

    verify(auditService).logAuthorisation(AktOperation.DELETE_AUTHORISATION, translator, authorisationId);
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testAuthorisationDeleteFailsForLastAuthorisation() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final RuntimeException ex = assertThrows(
      RuntimeException.class,
      () -> clerkTranslatorService.deleteAuthorisation(authorisation.getId())
    );

    assertEquals("Can not delete last authorisation", ex.getMessage());
    assertEquals(1, authorisationRepository.count());

    verifyNoInteractions(auditService);
  }

  @Test
  public void testAuthorisationCreateFailsOnMissingMeetingDate() {
    final LocalDate date = LocalDate.of(2022, 1, 19);
    final MeetingDate meetingDate = Factory.meetingDate(date.plusDays(1));
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);

    final AuthorisationCreateDTO createDTO = AuthorisationCreateDTO
      .builder()
      .basis(AuthorisationBasis.KKT)
      .kktCheck("checked")
      .assuranceDate(LocalDate.now())
      .meetingDate(date)
      .from(FI)
      .to(SV)
      .permissionToPublish(true)
      .termBeginDate(LocalDate.now())
      .termEndDate(LocalDate.now().plusDays(1))
      .diaryNumber("012345")
      .build();

    final RuntimeException ex = assertThrows(
      RuntimeException.class,
      () -> clerkTranslatorService.createAuthorisation(translator.getId(), createDTO)
    );
    assertEquals("Invalid meeting date: 2022-01-19", ex.getMessage());

    verifyNoInteractions(auditService);
  }

  private void assertResponseMatchesGet(final ClerkTranslatorDTO response) {
    final ClerkTranslatorDTO expected = clerkTranslatorService.getTranslatorWithoutAudit(response.id());

    assertNotNull(response);
    assertNotNull(expected);
    assertEquals(expected, response);
  }
}
