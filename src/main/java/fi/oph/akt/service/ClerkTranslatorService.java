package fi.oph.akt.service;

import fi.oph.akt.api.dto.ClerkLanguagePairDTO;
import fi.oph.akt.api.dto.ClerkTranslatorDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClerkTranslatorService {

	@Resource
	private TranslatorRepository translatorRepository;

	@Resource
	private LanguagePairRepository languagePairRepository;

	@Resource
	// TODO (OPHAKTKEH-52): use actual API outside local environment
	private OnrServiceMock onrServiceMock;

	@Transactional(readOnly = true)
	public Page<ClerkTranslatorDTO> list(Pageable pageable) {
		final Page<Translator> translators = translatorRepository.findAll(pageable);

		final Map<String, TranslatorDetails> translatorDetails = getTranslatorsDetails(translators.stream());

		final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs = languagePairRepository
				.findTranslatorLanguagePairs(translators.stream().map(Translator::getId).toList()).stream()
				.collect(Collectors.groupingBy(TranslatorLanguagePairProjection::translatorId));

		final List<ClerkTranslatorDTO> result = translators.stream().map(translator -> {
			final TranslatorDetails details = translatorDetails.get(translator.getOnrOid());
			final List<ClerkLanguagePairDTO> languagePairDTOs = getLanguagePairDTOs(translatorLanguagePairs,
					translator);

			return createClerkTranslatorDTO(translator, details, languagePairDTOs);
		}).toList();

		return new PageImpl<>(result, translators.getPageable(), translators.getTotalElements());
	}

	private Map<String, TranslatorDetails> getTranslatorsDetails(Stream<Translator> translators) {
		return onrServiceMock.getTranslatorDetailsByOids(translators.map(Translator::getOnrOid).toList());
	}

	private List<ClerkLanguagePairDTO> getLanguagePairDTOs(
			final Map<Long, List<TranslatorLanguagePairProjection>> translatorLanguagePairs, final Translator t) {

		return translatorLanguagePairs
				.getOrDefault(t.getId(), Collections.emptyList()).stream().map(tlp -> ClerkLanguagePairDTO.builder()
						.from(tlp.fromLang()).to(tlp.toLang()).permissionToPublish(tlp.permissionToPublish()).build())
				.toList();
	}

	private ClerkTranslatorDTO createClerkTranslatorDTO(Translator translator, TranslatorDetails details,
			List<ClerkLanguagePairDTO> languagePairDTOS) {
		// @formatter:off
        return ClerkTranslatorDTO.builder()
                .id(translator.getId())
                .oid(translator.getOnrOid())
                .firstName(details.firstName())
                .lastName(details.lastName())
                .email(details.email())
                .phone(details.phone())
                .mobilePhone(details.mobilePhone())
                .street(details.street())
                .postalCode(details.postalCode())
                .town(details.town())
                .country(details.country())
                .languagePairs(languagePairDTOS)
                .build();
        // @formatter:on
	}

}
