package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.PublicLanguagePairDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.TranslatorDTO;
import fi.oph.akt.api.dto.TranslatorDetailsDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.model.TranslatorDetails;
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
public class TranslatorService {

	private static final Logger LOG = LoggerFactory.getLogger(TranslatorService.class);

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	// TODO (OPHAKTKEH-52): use actual API outside local environment
	private OnrServiceMock onrServiceMock;

	@Transactional(readOnly = true)
	public Page<TranslatorDTO> listTranslators(Pageable pageable) {
		final Page<Translator> translators = translatorRepository.findAll(pageable);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairs(translators.stream().map(Translator::getId).toList()).stream()
				.collect(Collectors.groupingBy(TranslatorLanguagePairProjection::translatorId));

		final List<TranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());
			final TranslatorDetailsDTO detailsDTO = createTranslatorDetailsDTO(details);

			final List<LanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs, t);

			return TranslatorDTO.builder().id(t.getId()).oid(t.getOnrOid()).details(detailsDTO)
					.languagePairs(languagePairDTOs).build();
		}).toList();

		return new PageImpl<>(result, translators.getPageable(), translators.getTotalElements());
	}

	private TranslatorDetailsDTO createTranslatorDetailsDTO(TranslatorDetails details) {
		// @formatter:off
		return TranslatorDetailsDTO.builder()
				.nickname(details.nickname())
				.firstNames(details.firstNames())
				.surname(details.surname())
				.email(details.email())
				.phone(details.phone())
				.mobilePhone(details.mobilePhone())
				.street(details.street())
				.postalCode(details.postalCode())
				.town(details.town())
				.country(details.country())
				.build();
		// @formatter:on
	}

	private List<LanguagePairDTO> getLanguagePairDTOs(
			final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.getOrDefault(t.getId(), Collections.emptyList()).stream()
				.map(tlp -> LanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang())
						.permissionToPublish(tlp.permissionToPublish()).build())
				.toList();
	}

	@Transactional(readOnly = true)
	public Page<PublicTranslatorDTO> listPublicTranslators(Pageable pageable) {
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
		final List<PublicTranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());

			final List<PublicLanguagePairDTO> languagePairDTOs = getPublicLanguagePairDTOs(translatorLanguagePairs, t);

			return PublicTranslatorDTO.builder().id(t.getId()).lastName(details.surname()).firstName(details.nickname())
					.town(details.town()).country(details.country()).languagePairs(languagePairDTOs).build();
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
				.map(tlp -> PublicLanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang()).build())
				.toList();
	}

}
