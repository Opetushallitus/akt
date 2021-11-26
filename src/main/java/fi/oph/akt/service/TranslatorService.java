package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.api.dto.PublicLanguagePairDTO;
import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.api.dto.TranslatorDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.OnrServiceMock;
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
	private OnrServiceMock onrServiceMock;

	@Transactional(readOnly = true)
	public Page<TranslatorDTO> listTranslators(Pageable pageable) {
		final Page<Translator> translators = translatorRepository.findAll(pageable);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final List<TranslatorLanguagePairProjection> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairs(translators.stream().map(Translator::getId).toList());

		final List<TranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());

			final List<LanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs, t);

			return TranslatorDTO.builder().id(t.getId()).oid(t.getOnrOid()).details(details)
					.languagePairs(languagePairDTOs).build();
		}).toList();

		return new PageImpl<>(result, translators.getPageable(), translators.getTotalElements());
	}

	private List<LanguagePairDTO> getLanguagePairDTOs(
			final List<TranslatorLanguagePairProjection> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.stream().filter(tlp -> tlp.translatorId() == t.getId())
				.map(tlp -> LanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang())
						.permissionToPublish(tlp.permissionToPublish()).build())
				.toList();
	}

	@Transactional(readOnly = true)
	public Page<PublicTranslatorDTO> listPublicTranslators(Pageable pageable) {
		final Page<Long> translatorIds = translatorRepository.findIDsForPublicListing(pageable);

		final List<Translator> translators = translatorRepository.findAllById(translatorIds);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final List<TranslatorLanguagePairProjection> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairsForPublicListing(translators.stream().map(Translator::getId).toList());

		final List<PublicTranslatorDTO> result = translators.stream().map(t -> {
			final TranslatorDetails details = translatorDetails.get(t.getOnrOid());

			final List<PublicLanguagePairDTO> languagePairDTOs = getPublicLanguagePairDTOs(translatorLanguagePairs, t);

			return PublicTranslatorDTO.builder().id(t.getId()).lastName(details.surname()).firstName(details.nickname())
					.languagePairs(languagePairDTOs).build();
		}).toList();

		return new PageImpl<>(result, translatorIds.getPageable(), translatorIds.getTotalElements());
	}

	private Map<String, TranslatorDetails> getTranslatorsDetails(Stream<Translator> translators) {
		return onrServiceMock.getTranslatorDetailsByOids(translators.map(Translator::getOnrOid).toList());
	}

	private List<PublicLanguagePairDTO> getPublicLanguagePairDTOs(
			final List<TranslatorLanguagePairProjection> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs.stream().filter(tlp -> tlp.translatorId() == t.getId())
				.map(tlp -> PublicLanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang()).build())
				.toList();
	}

}
