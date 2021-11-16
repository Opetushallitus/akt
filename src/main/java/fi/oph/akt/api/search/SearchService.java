package fi.oph.akt.api.search;

import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorLanguagePairProjection;
import fi.oph.akt.repository.TranslatorRepository;
import java.util.List;
import java.util.stream.Stream;
import javax.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Transactional(readOnly = true)
	public Page<TranslatorDTO> listAll(Pageable pageable) {
		final Page<Long> translatorIds = translatorRepository.findIDsForPublicListing(pageable);

		final List<TranslatorLanguagePairProjection> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairsForPublicListing(translatorIds.getContent());

		// TODO Instead of fetching Translators, fetch personal data by translatorIds
		final List<Translator> all = translatorRepository.findAllById(translatorIds);
		final List<TranslatorDTO> result = all.stream().map((t) -> {
			String[] name = t.getOnrOid().split(", ");
			if (name.length < 2) {
				name = new String[] { t.getOnrOid(), t.getOnrOid() };
			}
			return createTranslatorDTO(t.getId(), name[0], name[1],
					findTranslatorLanguagePairs(translatorLanguagePairs, t));
		}).toList();
		return new PageImpl(result, translatorIds.getPageable(), translatorIds.getTotalElements());
	}

	private Stream<TranslatorLanguagePairProjection> findTranslatorLanguagePairs(
			final List<TranslatorLanguagePairProjection> translatorLanguagePairs, final Translator t) {
		final Stream<TranslatorLanguagePairProjection> languagePairs = translatorLanguagePairs.stream()
				.filter(tlp -> tlp.translatorId() == t.getId());
		return languagePairs;
	}

	private TranslatorDTO createTranslatorDTO(final long translatorId, final String lastName, final String firstName,
			final Stream<TranslatorLanguagePairProjection> languagePairs) {

		final List<LanguagePairDTO> languagePairDTOs = languagePairs
				.map(tlp -> LanguagePairDTO.builder().fromLang(tlp.fromLang()).toLang(tlp.toLang()).build()).toList();
		return TranslatorDTO.builder().id(translatorId).lastName(lastName).firstName(firstName)
				.languagePairs(languagePairDTOs).build();
	}

}
