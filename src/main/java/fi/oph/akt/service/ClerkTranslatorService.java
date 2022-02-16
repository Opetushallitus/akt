package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.clerk.AuthorisationDTO;
import fi.oph.akt.api.dto.clerk.AuthorisationTermDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationDTOCommonFields;
import fi.oph.akt.api.dto.clerk.modify.AuthorisationUpdateDTO;
import fi.oph.akt.api.dto.clerk.modify.TranslatorCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.TranslatorDTOCommonFields;
import fi.oph.akt.api.dto.clerk.modify.TranslatorUpdateDTO;
import fi.oph.akt.audit.AktOperation;
import fi.oph.akt.audit.AuditService;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.AuthorisationTermReminder;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationProjection;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.AuthorisationTermProjection;
import fi.oph.akt.repository.AuthorisationTermReminderRepository;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.AuthorisationTermProjectionComparator;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClerkTranslatorService {

  private static final AuthorisationTermProjectionComparator authorisationTermProjectionComparator = new AuthorisationTermProjectionComparator();

  @Resource
  private final AuthorisationRepository authorisationRepository;

  @Resource
  private final AuthorisationTermRepository authorisationTermRepository;

  @Resource
  private final AuthorisationTermReminderRepository authorisationTermReminderRepository;

  @Resource
  private final MeetingDateService meetingDateService;

  @Resource
  private final MeetingDateRepository meetingDateRepository;

  @Resource
  private final TranslatorRepository translatorRepository;

  @Resource
  private final AuditService auditService;

  @Transactional(readOnly = true)
  public ClerkTranslatorResponseDTO listTranslators() {
    final ClerkTranslatorResponseDTO result = listTranslatorsWithoutAudit();
    auditService.logOperation(AktOperation.LIST_TRANSLATORS);
    return result;
  }

  private ClerkTranslatorResponseDTO listTranslatorsWithoutAudit() {
    final List<Translator> translators = translatorRepository.findAll();
    final Map<Long, List<AuthorisationProjection>> authorisationProjections = getAuthorisationProjections();
    final Map<Long, List<AuthorisationTermProjection>> termProjections = getAuthorisationTermProjections();
    final List<ClerkTranslatorDTO> clerkTranslatorDTOS = createClerkTranslatorDTOs(
      translators,
      authorisationProjections,
      termProjections
    );
    final LanguagePairsDictDTO languagePairsDictDTO = getLanguagePairsDictDTO();
    final List<String> towns = getDistinctTowns(translators);
    final List<MeetingDateDTO> meetingDateDTOS = meetingDateService.listMeetingDatesWithoutAudit();

    return ClerkTranslatorResponseDTO
      .builder()
      .translators(clerkTranslatorDTOS)
      .langs(languagePairsDictDTO)
      .towns(towns)
      .meetingDates(meetingDateDTOS)
      .build();
  }

  private Map<Long, List<AuthorisationProjection>> getAuthorisationProjections() {
    return authorisationRepository
      .listAuthorisationProjections()
      .stream()
      .collect(Collectors.groupingBy(AuthorisationProjection::translatorId));
  }

  private Map<Long, List<AuthorisationTermProjection>> getAuthorisationTermProjections() {
    return authorisationTermRepository
      .listAuthorisationTermProjections()
      .stream()
      .collect(Collectors.groupingBy(AuthorisationTermProjection::authorisationId));
  }

  private List<ClerkTranslatorDTO> createClerkTranslatorDTOs(
    final List<Translator> translators,
    final Map<Long, List<AuthorisationProjection>> authorisationProjectionsByTranslator,
    final Map<Long, List<AuthorisationTermProjection>> termProjectionsByAuthorisation
  ) {
    return translators
      .stream()
      .map(translator -> {
        final List<AuthorisationDTO> authorisationDTOS = getAuthorisationDTOs(
          authorisationProjectionsByTranslator.get(translator.getId()),
          termProjectionsByAuthorisation
        );

        return ClerkTranslatorDTO
          .builder()
          .id(translator.getId())
          .version(translator.getVersion())
          .firstName(translator.getFirstName())
          .lastName(translator.getLastName())
          .identityNumber(translator.getIdentityNumber())
          .email(translator.getEmail())
          .phoneNumber(translator.getPhone())
          .street(translator.getStreet())
          .postalCode(translator.getPostalCode())
          .town(translator.getTown())
          .country(translator.getCountry())
          .extraInformation(translator.getExtraInformation())
          .authorisations(authorisationDTOS)
          .build();
      })
      .toList();
  }

  private List<AuthorisationDTO> getAuthorisationDTOs(
    final List<AuthorisationProjection> authorisationProjections,
    final Map<Long, List<AuthorisationTermProjection>> termProjectionsByAuthorisation
  ) {
    return authorisationProjections
      .stream()
      .map(authProjection -> {
        List<AuthorisationTermDTO> termDTOS = null;
        final List<AuthorisationTermProjection> termProjections = termProjectionsByAuthorisation.getOrDefault(
          authProjection.id(),
          null
        );

        if (termProjections != null) {
          termDTOS =
            termProjections
              .stream()
              .sorted(authorisationTermProjectionComparator.reversed())
              .map(tp ->
                AuthorisationTermDTO
                  .builder()
                  .id(tp.id())
                  .version(tp.version())
                  .beginDate(tp.beginDate())
                  .endDate(tp.endDate())
                  .build()
              )
              .toList();
        }

        final LanguagePairDTO languagePairDTO = LanguagePairDTO
          .builder()
          .from(authProjection.fromLang())
          .to(authProjection.toLang())
          .build();

        return AuthorisationDTO
          .builder()
          .id(authProjection.id())
          .version(authProjection.version())
          .languagePair(languagePairDTO)
          .basis(authProjection.authorisationBasis())
          .diaryNumber(authProjection.diaryNumber())
          .autDate(authProjection.autDate())
          .kktCheck(authProjection.kktCheck())
          .virDate(authProjection.virDate())
          .assuranceDate(authProjection.assuranceDate())
          .meetingDate(authProjection.meetingDate())
          .terms(termDTOS)
          .permissionToPublish(authProjection.permissionToPublish())
          .build();
      })
      .toList();
  }

  private LanguagePairsDictDTO getLanguagePairsDictDTO() {
    final List<String> fromLangs = authorisationRepository.getDistinctFromLangs();
    final List<String> toLangs = authorisationRepository.getDistinctToLangs();

    return LanguagePairsDictDTO.builder().from(fromLangs).to(toLangs).build();
  }

  private List<String> getDistinctTowns(final Collection<Translator> translators) {
    return translators.stream().map(Translator::getTown).filter(Objects::nonNull).distinct().sorted().toList();
  }

  @Transactional
  public ClerkTranslatorDTO createTranslator(final TranslatorCreateDTO dto) {
    final Translator translator = new Translator();

    copyDtoFieldsToTranslator(dto, translator);

    translatorRepository.saveAndFlush(translator);

    final Map<LocalDate, MeetingDate> meetingDates = getLocalDateMeetingDateMap();

    dto.authorisations().forEach(authDto -> createAuthorisation(translator, meetingDates, authDto));

    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translator.getId());
    auditService.logById(AktOperation.CREATE_TRANSLATOR, translator.getId());
    return result;
  }

  @Transactional(readOnly = true)
  public ClerkTranslatorDTO getTranslator(final long translatorId) {
    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translatorId);
    auditService.logById(AktOperation.GET_TRANSLATOR, translatorId);
    return result;
  }

  public ClerkTranslatorDTO getTranslatorWithoutAudit(final long translatorId) {
    // This could be optimized, by fetching only one translator and it's data, but is it worth of the programming work?
    for (ClerkTranslatorDTO t : listTranslatorsWithoutAudit().translators()) {
      if (t.id() == translatorId) {
        return t;
      }
    }
    throw new RuntimeException(String.format("Translator with id: %d not found", translatorId));
  }

  @Transactional
  public ClerkTranslatorDTO updateTranslator(final TranslatorUpdateDTO dto) {
    final Translator translator = translatorRepository.getById(dto.id());
    translator.assertVersion(dto.version());

    copyDtoFieldsToTranslator(dto, translator);

    translatorRepository.flush();

    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translator.getId());
    auditService.logById(AktOperation.UPDATE_TRANSLATOR, translator.getId());
    return result;
  }

  private void copyDtoFieldsToTranslator(final TranslatorDTOCommonFields dto, final Translator translator) {
    translator.setIdentityNumber(dto.identityNumber());
    translator.setFirstName(dto.firstName());
    translator.setLastName(dto.lastName());
    translator.setEmail(dto.email());
    translator.setPhone(dto.phoneNumber());
    translator.setStreet(dto.street());
    translator.setTown(dto.town());
    translator.setPostalCode(dto.postalCode());
    translator.setCountry(dto.country());
    translator.setExtraInformation(dto.extraInformation());
  }

  @Transactional
  public void deleteTranslator(final long translatorId) {
    final Translator translator = translatorRepository.getById(translatorId);

    final Collection<Authorisation> authorisations = translator.getAuthorisations();
    final List<AuthorisationTerm> terms = authorisations.stream().flatMap(a -> a.getTerms().stream()).toList();
    final List<AuthorisationTermReminder> reminders = terms.stream().flatMap(t -> t.getReminders().stream()).toList();

    authorisationTermReminderRepository.deleteAllInBatch(reminders);
    authorisationTermRepository.deleteAllInBatch(terms);
    authorisationRepository.deleteAllInBatch(authorisations);
    translatorRepository.deleteAllInBatch(List.of(translator));

    auditService.logById(AktOperation.DELETE_TRANSLATOR, translatorId);
  }

  @Transactional
  public ClerkTranslatorDTO createAuthorisation(final long translatorId, final AuthorisationCreateDTO dto) {
    final Translator translator = translatorRepository.getById(translatorId);
    final Map<LocalDate, MeetingDate> meetingDates = getLocalDateMeetingDateMap();
    final Authorisation authorisation = createAuthorisation(translator, meetingDates, dto);

    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translator.getId());
    auditService.logAuthorisation(AktOperation.CREATE_AUTHORISATION, translator, authorisation.getId());
    return result;
  }

  private Authorisation createAuthorisation(
    final Translator translator,
    final Map<LocalDate, MeetingDate> meetingDates,
    final AuthorisationCreateDTO dto
  ) {
    final Authorisation authorisation = new Authorisation();
    translator.getAuthorisations().add(authorisation);
    authorisation.setTranslator(translator);

    copyDtoFieldsToAuthorisation(dto, authorisation, meetingDates);

    authorisationRepository.saveAndFlush(authorisation);

    final AuthorisationTerm term = new AuthorisationTerm();
    authorisation.getTerms().add(term);
    term.setAuthorisation(authorisation);
    term.setBeginDate(dto.beginDate());
    term.setEndDate(dto.endDate());

    authorisationTermRepository.saveAndFlush(term);

    return authorisation;
  }

  @Transactional
  public ClerkTranslatorDTO updateAuthorisation(final AuthorisationUpdateDTO dto) {
    final Map<LocalDate, MeetingDate> meetingDates = getLocalDateMeetingDateMap();

    final Authorisation authorisation = authorisationRepository.getById(dto.id());
    authorisation.assertVersion(dto.version());

    copyDtoFieldsToAuthorisation(dto, authorisation, meetingDates);

    final Collection<AuthorisationTerm> terms = authorisation.getTerms();
    if (terms.size() != 1) {
      throw new RuntimeException(
        String.format(
          "Authorisation id: %d has invalid number of authorisation terms %d",
          authorisation.getId(),
          terms.size()
        )
      );
    }
    final AuthorisationTerm term = terms.iterator().next();
    term.setBeginDate(dto.beginDate());
    term.setEndDate(dto.endDate());

    authorisationRepository.flush();
    authorisationTermRepository.flush();

    final Translator translator = authorisation.getTranslator();

    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translator.getId());
    auditService.logAuthorisation(AktOperation.UPDATE_AUTHORISATION, translator, authorisation.getId());
    return result;
  }

  private void copyDtoFieldsToAuthorisation(
    final AuthorisationDTOCommonFields dto,
    final Authorisation authorisation,
    final Map<LocalDate, MeetingDate> meetingDates
  ) {
    final MeetingDate meetingDate = meetingDates.get(dto.meetingDate());
    if (meetingDate == null) {
      throw new RuntimeException("Invalid meeting date: " + dto.meetingDate());
    }
    authorisation.setBasis(dto.basis());
    authorisation.setAutDate(dto.autDate());
    authorisation.setKktCheck(dto.kktCheck());
    authorisation.setVirDate(dto.virDate());
    authorisation.setAssuranceDate(dto.assuranceDate());
    authorisation.setMeetingDate(meetingDate);
    authorisation.setFromLang(dto.from());
    authorisation.setToLang(dto.to());
    authorisation.setPermissionToPublish(dto.permissionToPublish());
    authorisation.setDiaryNumber(dto.diaryNumber());
  }

  @Transactional
  public ClerkTranslatorDTO deleteAuthorisation(final long authorisationId) {
    final Authorisation authorisation = authorisationRepository.getById(authorisationId);
    final Translator translator = authorisation.getTranslator();
    if (translator.getAuthorisations().size() == 1) {
      throw new RuntimeException("Can not delete last authorisation");
    }

    final Collection<AuthorisationTerm> terms = authorisation.getTerms();
    final List<AuthorisationTermReminder> reminders = terms.stream().flatMap(t -> t.getReminders().stream()).toList();

    authorisationTermReminderRepository.deleteAllInBatch(reminders);
    authorisationTermRepository.deleteAllInBatch(terms);
    authorisationRepository.deleteAllInBatch(List.of(authorisation));

    final ClerkTranslatorDTO result = getTranslatorWithoutAudit(translator.getId());
    auditService.logAuthorisation(AktOperation.DELETE_AUTHORISATION, translator, authorisationId);
    return result;
  }

  private Map<LocalDate, MeetingDate> getLocalDateMeetingDateMap() {
    return meetingDateRepository
      .findAll()
      .stream()
      .collect(Collectors.toMap(MeetingDate::getDate, Function.identity()));
  }
}
