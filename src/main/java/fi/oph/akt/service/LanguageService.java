package fi.oph.akt.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.oph.akt.api.dto.LanguageDTO;
import fi.oph.akt.api.dto.LocaleDTO;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
public class LanguageService {

	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

	static final String UNOFFICIAL_LANGUAGE = "98";
	static final String UNKNOWN_LANGUAGE = "99";
	static final String OTHER_LANGUAGE = "XX";
	static final String SIGN_LANGUAGE = "VK";

	private static final Set<String> IGNORED_LANGUAGE_CODES = Set.of(UNOFFICIAL_LANGUAGE, UNKNOWN_LANGUAGE,
			OTHER_LANGUAGE, SIGN_LANGUAGE);

	private final WebClient webClient;

	@Cacheable("koodistoLanguages")
	public Map<LocaleDTO, List<LanguageDTO>> allLanguages() {
		try {
			final Mono<String> response = webClient.get().retrieve().bodyToMono(String.class);
			final String result = response.block();
			final List<KoodistoLang> koodistoLanguages = deserializeJson(result);
			final List<KoodistoLang> filteredLanguages = koodistoLanguages.stream()
					.filter(k -> !IGNORED_LANGUAGE_CODES.contains(k.koodiArvo)).toList();
			return convert(filteredLanguages);
		}
		catch (final JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}

	private List<KoodistoLang> deserializeJson(final String result) throws JsonProcessingException {
		return OBJECT_MAPPER.readValue(result, new TypeReference<>() {
		});
	}

	private Map<LocaleDTO, List<LanguageDTO>> convert(final List<KoodistoLang> langs) {
		final Map<LocaleDTO, List<LanguageDTO>> map = new HashMap<>();
		langs.forEach(lang -> {
			final String code = lang.koodiArvo;
			final String nameFI = findLang(null, "FI", lang.metadata);
			final String nameSV = findLang("FI", "SV", lang.metadata);
			final String nameEN = findLang("FI", "EN", lang.metadata);
			final LanguageDTO fi = LanguageDTO.builder().code(code).name(nameFI).build();
			final LanguageDTO sv = LanguageDTO.builder().code(code).name(nameSV).build();
			final LanguageDTO en = LanguageDTO.builder().code(code).name(nameEN).build();
			map.computeIfAbsent(LocaleDTO.FI, k -> new ArrayList<>(langs.size())).add(fi);
			map.computeIfAbsent(LocaleDTO.SV, k -> new ArrayList<>(langs.size())).add(sv);
			map.computeIfAbsent(LocaleDTO.EN, k -> new ArrayList<>(langs.size())).add(en);
		});
		return map;
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
