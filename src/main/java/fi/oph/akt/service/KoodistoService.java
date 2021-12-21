package fi.oph.akt.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.oph.akt.api.dto.LanguageDTO;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
public class KoodistoService {

	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

	static final String UNOFFICIAL_LANGUAGE = "98";
	static final String UNKNOWN_LANGUAGE = "99";
	static final String OTHER_LANGUAGE = "XX";
	static final String SIGN_LANGUAGE = "VK";

	private static final List<String> FILTER_LANGUAGES = List.of(UNOFFICIAL_LANGUAGE, UNKNOWN_LANGUAGE, OTHER_LANGUAGE,
			SIGN_LANGUAGE);

	private final WebClient webClient;

	@Cacheable("koodistoLanguages")
	public List<LanguageDTO> allLanguages() throws JsonProcessingException {
		final Mono<String> response = webClient.get().retrieve().bodyToMono(String.class);
		final String result = response.block();
		final List<KoodistoLang> koodistoLanguages = deserializeJson(result);
		return toDTOs(koodistoLanguages);
	}

	private List<KoodistoLang> deserializeJson(String result) throws JsonProcessingException {
		return OBJECT_MAPPER.readValue(result, new TypeReference<>() {
		});
	}

	private List<LanguageDTO> toDTOs(List<KoodistoLang> koodistoLanguages) {
		return koodistoLanguages.stream().filter(k -> !FILTER_LANGUAGES.contains(k.koodiArvo)).map(this::toDTO)
				.toList();
	}

	private LanguageDTO toDTO(final KoodistoLang koodistoLang) {
		final String fi = findLang(null, "FI", koodistoLang.metadata);
		final String sv = findLang(fi, "SV", koodistoLang.metadata);
		final String en = findLang(fi, "EN", koodistoLang.metadata);
		// @formatter:off
		return LanguageDTO.builder()
				.code(koodistoLang.koodiArvo)
				.fi(fi)
				.sv(sv)
				.en(en)
				.build();
		// @formatter:on
	}

	private String findLang(final String fallback, final String lang, final List<KoodistoLangMeta> metadata) {
		return metadata.stream().filter(m -> m.kieli.equalsIgnoreCase(lang)).map(KoodistoLangMeta::nimi).findFirst()
				.orElse(fallback);
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	private record KoodistoLang(@NonNull String koodiArvo, List<KoodistoLangMeta> metadata) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	private record KoodistoLangMeta(@NonNull String kieli, String nimi, String lyhytNimi) {
	}

}
