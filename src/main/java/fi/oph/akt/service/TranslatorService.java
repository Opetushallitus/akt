package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.TranslatorDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.OnrApiMock;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorLanguagePairProjection;
import fi.oph.akt.repository.TranslatorRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import javax.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TranslatorService {

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	// TODO (OPHAKTKEH-52): use actual API outside local environment
	private OnrApiMock onrApiMock;

	@Transactional(readOnly = true)
	public Page<TranslatorDTO> listTranslators(Pageable pageable) {
		final Page<Translator> translators = translatorRepository.findAll(pageable);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final List<TranslatorLanguagePairProjection> translatorLanguagePairs = getLanguagePairProjections(
				translators.stream());

		final List<TranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());
			final List<LanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs, t);

			return TranslatorDTO.builder().id(t.getId()).oid(t.getOnrOid()).details(details)
					.languagePairs(languagePairDTOs).build();
		}).toList();

		return new PageImpl<>(result, translators.getPageable(), translators.getTotalElements());
	}

	@Transactional(readOnly = true)
	public Page<PublicTranslatorDTO> listPublicTranslators(Pageable pageable) {
		final Page<Long> translatorIds = translatorRepository.findIDsForPublicListing(pageable);

		final List<Translator> translators = translatorRepository.findAllById(translatorIds);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final List<TranslatorLanguagePairProjection> translatorLanguagePairs = getLanguagePairProjections(
				translators.stream());

		final List<PublicTranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());
			final List<LanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs, t);

			return PublicTranslatorDTO.builder().id(t.getId()).lastName(details.surname()).firstName(details.nickname())
					.languagePairs(languagePairDTOs).build();
		}).toList();

		return new PageImpl<>(result, translatorIds.getPageable(), translatorIds.getTotalElements());
	}

	private Map<String, TranslatorDetails> getTranslatorsDetails(Stream<Translator> translators) {
		return onrApiMock.getTranslatorDetailsByOids(translators.map(Translator::getOnrOid).toList());
	}

	private List<TranslatorLanguagePairProjection> getLanguagePairProjections(Stream<Translator> translators) {
		return languagePairRepository
				.findTranslatorLanguagePairsForPublicListing(translators.map(Translator::getId).toList());
	}

	private List<LanguagePairDTO> getLanguagePairDTOs(
			final List<TranslatorLanguagePairProjection> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.stream().filter(tlp -> tlp.translatorId() == t.getId())
				.map(tlp -> LanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang()).build()).toList();
	}

}
