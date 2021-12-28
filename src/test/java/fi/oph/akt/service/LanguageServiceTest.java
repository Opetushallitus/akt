package fi.oph.akt.service;

import fi.oph.akt.TestUtil;
import fi.oph.akt.api.dto.LanguageDTO;
import fi.oph.akt.api.dto.LocaleDTO;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LanguageServiceTest {

	private LanguageService languageService;

	@BeforeEach
	public void setup() throws IOException {
		final MockWebServer mockWebServer = new MockWebServer();
		final String languagesJson = TestUtil.readResourceAsString("json/koodisto-kieli.json");
		mockWebServer.enqueue(new MockResponse().setResponseCode(200)
				.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).setBody(languagesJson));

		final String mockWebServerBaseUrl = mockWebServer.url("/").url().toString();
		final WebClient webClient = WebClient.builder().baseUrl(mockWebServerBaseUrl).build();
		languageService = new LanguageService(webClient);
	}

	@Test
	public void testLanguageService() {
		final Map<LocaleDTO, List<LanguageDTO>> languagesMap = languageService.allLanguages();

		assertEquals(3, languagesMap.size());
		verifyLanguageDTOs(languagesMap.get(LocaleDTO.FI));
		verifyLanguageDTOs(languagesMap.get(LocaleDTO.SV));
		verifyLanguageDTOs(languagesMap.get(LocaleDTO.EN));
	}

	private void verifyLanguageDTOs(final List<LanguageDTO> languageDtos) {
		assertEquals(2, languageDtos.size());
		assertFalse(languageDtos.stream().anyMatch(dto -> dto.code().equals(LanguageService.UNOFFICIAL_LANGUAGE)));
		assertFalse(languageDtos.stream().anyMatch(dto -> dto.code().equals(LanguageService.UNKNOWN_LANGUAGE)));
		assertFalse(languageDtos.stream().anyMatch(dto -> dto.code().equals(LanguageService.OTHER_LANGUAGE)));
		assertFalse(languageDtos.stream().anyMatch(dto -> dto.code().equals(LanguageService.SIGN_LANGUAGE)));
		assertTrue(languageDtos.stream().anyMatch(dto -> dto.code().equals("FI")));
		assertTrue(languageDtos.stream().anyMatch(dto -> dto.code().equals("SV")));
	}

}