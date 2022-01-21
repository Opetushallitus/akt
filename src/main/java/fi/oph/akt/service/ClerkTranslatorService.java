package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.clerk.AuthorisationDTO;
import fi.oph.akt.api.dto.clerk.AuthorisationTermDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorContactDetailsDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationProjection;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.AuthorisationTermProjection;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.AuthorisationTermProjectionComparator;
import fi.oph.akt.util.MeetingDateProjectionComparator;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

@Service
@RequiredArgsConstructor
public class ClerkTranslatorService {

  private static final Logger LOG = LoggerFactory.getLogger(ClerkTranslatorService.class);

  private static final AuthorisationTermProjectionComparator authorisationTermProjectionComparator = new AuthorisationTermProjectionComparator();

  private static final MeetingDateProjectionComparator meetingDateProjectionComparator = new MeetingDateProjectionComparator();

  @Resource
  private final AuthorisationRepository authorisationRepository;

  @Resource
  private final AuthorisationTermRepository authorisationTermRepository;

  @Resource
  private final MeetingDateRepository meetingDateRepository;

  @Resource
  private final TranslatorRepository translatorRepository;

  @Transactional(readOnly = true)
  public ClerkTranslatorResponseDTO listTranslators() {
    final StopWatch st = new StopWatch();

    st.start("translatorRepository.findAll");
    final List<Translator> translators = translatorRepository.findAll();
    st.stop();

    st.start("getAuthorisationProjections");
    final Map<Long, List<AuthorisationProjection>> authorisationProjections = getAuthorisationProjections();
    st.stop();

    st.start("getAuthorisationTermProjections");
    final Map<Long, List<AuthorisationTermProjection>> termProjections = getAuthorisationTermProjections();
    st.stop();

    st.start("createClerkTranslatorDTOs");
    final List<ClerkTranslatorDTO> clerkTranslatorDTOS = createClerkTranslatorDTOs(
      translators,
      authorisationProjections,
      termProjections
    );
    st.stop();

    st.start("getLanguagePairsDictDTO");
    final LanguagePairsDictDTO languagePairsDictDTO = getLanguagePairsDictDTO();
    st.stop();

    st.start("getDistinctTowns");
    final List<String> towns = getDistinctTowns(translators);
    st.stop();

    st.start("getMeetingDateDTOs");
    final List<MeetingDateDTO> meetingDateDTOS = getMeetingDateDTOs();
    st.stop();

    LOG.info(st.prettyPrint());

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
        final ClerkTranslatorContactDetailsDTO contactDetailsDTO = getContactDetailsDTO(translator);

        final List<AuthorisationDTO> authorisationDTOS = getAuthorisationDTOs(
          authorisationProjectionsByTranslator.get(translator.getId()),
          termProjectionsByAuthorisation
        );

        return ClerkTranslatorDTO
          .builder()
          .id(translator.getId())
          .version(translator.getVersion())
          .contactDetails(contactDetailsDTO)
          .authorisations(authorisationDTOS)
          .build();
      })
      .toList();
  }

  private ClerkTranslatorContactDetailsDTO getContactDetailsDTO(final Translator translator) {
    return ClerkTranslatorContactDetailsDTO
      .builder()
      .firstName(translator.getFirstName())
      .lastName(translator.getLastName())
      .email(translator.getEmail())
      .phoneNumber(translator.getPhone())
      .identityNumber(translator.getIdentityNumber())
      .street(translator.getStreet())
      .postalCode(translator.getPostalCode())
      .town(translator.getTown())
      .country(translator.getCountry())
      .build();
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

  private List<MeetingDateDTO> getMeetingDateDTOs() {
    return meetingDateRepository
      .listMeetingDateProjections()
      .stream()
      .sorted(meetingDateProjectionComparator.reversed())
      .map(mdp -> MeetingDateDTO.builder().id(mdp.meetingDateId()).date(mdp.date()).build())
      .toList();
  }
}
