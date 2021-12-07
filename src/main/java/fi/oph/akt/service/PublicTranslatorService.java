package fi.oph.akt.service;

import fi.oph.akt.api.dto.PublicLanguagePairDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.onr.TranslatorDetails;
import fi.oph.akt.onr.OnrServiceMock;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorLanguagePairProjection;
import fi.oph.akt.repository.TranslatorRepository;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

@Service
public class PublicTranslatorService {

	private static final Logger LOG = LoggerFactory.getLogger(PublicTranslatorService.class);

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	// TODO (OPHAKTKEH-52): use actual API outside local environment
	private OnrServiceMock onrServiceMock;

	@Transactional(readOnly = true)
	public Page<PublicTranslatorDTO> list(Pageable pageable) {
		final StopWatch st = new StopWatch();

		st.start("findIDsForPublicListing");
		final Page<Long> translatorIds = translatorRepository.findIDsForPublicListing(pageable);
		st.stop();

		st.start("findAllById");
		final List<Translator> translators = translatorRepository.findAllById(translatorIds);
		st.stop();

		st.start("getTranslatorsDetails");
		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());
		st.stop();

		st.start("findTranslatorLanguagePairsForPublicListing");
		final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairsForPublicListing(translators.stream().map(Translator::getId).toList())
				.stream().collect(Collectors.groupingBy(TranslatorLanguagePairProjection::translatorId));
		st.stop();

		st.start("translators.stream()");
		final List<PublicTranslatorDTO> result = translators.stream().map(translator -> {
			final TranslatorDetails details = translatorDetails.get(translator.getOnrOid());
			final List<PublicLanguagePairDTO> languagePairDTOs = getPublicLanguagePairDTOs(translatorLanguagePairs,
					translator);

			return createPublicTranslatorDTO(translator, details, languagePairDTOs);
		}).toList();

		st.stop();
		LOG.info(st.prettyPrint());
		return new PageImpl<>(result, translatorIds.getPageable(), translatorIds.getTotalElements());
	}

	private Map<String, TranslatorDetails> getTranslatorsDetails(Stream<Translator> translators) {
		return onrServiceMock.getTranslatorDetailsByOids(translators.map(Translator::getOnrOid).toList());
	}

	private List<PublicLanguagePairDTO> getPublicLanguagePairDTOs(
			final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.getOrDefault(t.getId(), Collections.emptyList()).stream()
				.map(tlp -> PublicLanguagePairDTO.builder().from(tlp.fromLang()).to(tlp.toLang()).build()).toList();
	}

	private PublicTranslatorDTO createPublicTranslatorDTO(Translator translator, TranslatorDetails details,
			List<PublicLanguagePairDTO> languagePairDTOS) {
		// @formatter:off
		return PublicTranslatorDTO.builder()
				.id(translator.getId())
				.firstName(details.firstName())
				.lastName(details.lastName())
				.town(details.town())
				.country(details.country())
				.languagePairs(languagePairDTOS)
				.build();
		// @formatter:on
	}

}
