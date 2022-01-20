package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.translator.PublicTranslatorDTO;
import fi.oph.akt.api.dto.translator.PublicTranslatorResponseDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.TranslatorLanguagePairProjection;
import fi.oph.akt.repository.TranslatorRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

@Service
public class PublicTranslatorService {

  private static final Logger LOG = LoggerFactory.getLogger(PublicTranslatorService.class);

  @Resource
  private AuthorisationRepository authorisationRepository;

  @Resource
  private TranslatorRepository translatorRepository;

  @Transactional(readOnly = true)
  public PublicTranslatorResponseDTO listTranslators() {
    final StopWatch st = new StopWatch();

    st.start("findTranslatorLanguagePairsForPublicListing");
    final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs = authorisationRepository
      .findTranslatorLanguagePairsForPublicListing()
      .stream()
      .collect(Collectors.groupingBy(TranslatorLanguagePairProjection::translatorId));
    st.stop();

    st.start("findTranslatorsByIds");
    final List<Translator> translators = translatorRepository.findAllById(translatorLanguagePairs.keySet());
    st.stop();

    st.start("createPublicTranslatorDTOs");
    final List<PublicTranslatorDTO> publicTranslatorDTOS = translators
      .stream()
      .map(translator -> {
        final List<LanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs, translator);

        return createPublicTranslatorDTO(translator, languagePairDTOs);
      })
      .toList();
    st.stop();

    st.start("getLanguagePairsDictDTO");
    final LanguagePairsDictDTO languagePairsDictDTO = getLanguagePairsDictDTO();
    st.stop();

    st.start("getDistinctTowns");
    final List<String> towns = getDistinctTowns(translators);
    st.stop();

    LOG.info(st.prettyPrint());

    return PublicTranslatorResponseDTO
      .builder()
      .translators(publicTranslatorDTOS)
      .langs(languagePairsDictDTO)
      .towns(towns)
      .build();
  }

  private List<LanguagePairDTO> getLanguagePairDTOs(
    final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs,
    final Translator t
  ) {
    return translatorLanguagePairs
      .getOrDefault(t.getId(), Collections.emptyList())
      .stream()
      .map(tlp -> LanguagePairDTO.builder().from(tlp.fromLang()).to(tlp.toLang()).build())
      .toList();
  }

  private PublicTranslatorDTO createPublicTranslatorDTO(
    final Translator translator,
    final List<LanguagePairDTO> languagePairDTOS
  ) {
    final String country = Optional
      .ofNullable(translator.getCountry())
      .filter(c -> !(Set.of("suomi", "finland").contains(c.toLowerCase())))
      .orElse(null);

    return PublicTranslatorDTO
      .builder()
      .id(translator.getId())
      .firstName(translator.getFirstName())
      .lastName(translator.getLastName())
      .town(translator.getTown())
      .country(country)
      .languagePairs(languagePairDTOS)
      .build();
  }

  private LanguagePairsDictDTO getLanguagePairsDictDTO() {
    final List<String> fromLangs = authorisationRepository.getDistinctFromLangs();
    final List<String> toLangs = authorisationRepository.getDistinctToLangs();

    return LanguagePairsDictDTO.builder().from(fromLangs).to(toLangs).build();
  }

  private List<String> getDistinctTowns(final Collection<Translator> translators) {
    return translators.stream().map(Translator::getTown).filter(Objects::nonNull).distinct().sorted().toList();
  }
}
