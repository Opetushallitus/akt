package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.PublicLanguagePairDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.PublicTranslatorResponseDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorLanguagePairProjection;
import fi.oph.akt.repository.TranslatorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PublicTranslatorService {

	private static final Logger LOG = LoggerFactory.getLogger(PublicTranslatorService.class);

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	private TranslatorRepository translatorRepository;

	@Transactional(readOnly = true)
	public PublicTranslatorResponseDTO listTranslators() {
		final StopWatch st = new StopWatch();

		st.start("findTranslatorsForPublicListing");
		final List<Translator> translators = translatorRepository.findTranslatorsForPublicListing();
		st.stop();

		st.start("findTranslatorLanguagePairsForPublicListing");
		final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairsForPublicListing(translators.stream().map(Translator::getId).toList())
				.stream().collect(Collectors.groupingBy(TranslatorLanguagePairProjection::translatorId));
		st.stop();

		st.start("createPublicTranslatorDTOs");
		final List<PublicTranslatorDTO> publicTranslatorDTOS = translators.stream().map(translator -> {
			final List<PublicLanguagePairDTO> languagePairDTOs = getPublicLanguagePairDTOs(translatorLanguagePairs,
					translator);

			return createPublicTranslatorDTO(translator, languagePairDTOs);
		}).toList();
		st.stop();

		st.start("getLanguagePairsDictDTO");
		LanguagePairsDictDTO languagePairsDictDTO = getLanguagePairsDictDTO();
		st.stop();

		st.start("getDistinctTowns");
		List<String> towns = getDistinctTowns(translators);
		st.stop();

		LOG.info(st.prettyPrint());

		// @formatter:off
		return PublicTranslatorResponseDTO.builder()
				.translators(publicTranslatorDTOS)
				.langs(languagePairsDictDTO)
				.towns(towns)
				.build();
		// @formatter:on
	}

	private List<PublicLanguagePairDTO> getPublicLanguagePairDTOs(
			final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.getOrDefault(t.getId(), Collections.emptyList()).stream()
				.map(tlp -> PublicLanguagePairDTO.builder().from(tlp.fromLang()).to(tlp.toLang()).build()).toList();
	}

	private PublicTranslatorDTO createPublicTranslatorDTO(Translator translator,
			List<PublicLanguagePairDTO> languagePairDTOS) {
		// @formatter:off
		String country = Optional
				.ofNullable(translator.getCountry())
				.filter(c -> !(Set.of("suomi", "finland").contains(c.toLowerCase())))
				.orElse(null);

		return PublicTranslatorDTO.builder()
				.id(translator.getId())
				.firstName(translator.getFirstName())
				.lastName(translator.getLastName())
				.town(translator.getTown())
				.country(country)
				.languagePairs(languagePairDTOS)
				.build();
		// @formatter:on
	}

	private LanguagePairsDictDTO getLanguagePairsDictDTO() {
		List<String> fromLangs = languagePairRepository.getDistinctFromLangs();
		List<String> toLangs = languagePairRepository.getDistinctToLangs();

		return LanguagePairsDictDTO.builder().from(fromLangs).to(toLangs).build();
	}

	private List<String> getDistinctTowns(Collection<Translator> translatorDetails) {
		return translatorDetails.stream().map(Translator::getTown).filter(Objects::nonNull).distinct().sorted()
				.toList();
	}

}
