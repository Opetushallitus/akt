package fi.oph.akt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import fi.oph.akt.TestUtil;
import fi.oph.akt.api.dto.LanguageDTO;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class KoodistoServiceTest {

	private KoodistoService koodistoService;

	@BeforeEach
	public void setup() throws IOException {
		final MockWebServer mockWebServer = new MockWebServer();
		final String languagesJson = TestUtil.readResourceAsString("json/koodisto-kieli.json");
		mockWebServer.enqueue(new MockResponse().setResponseCode(200)
				.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).setBody(languagesJson));

		final String mockWebServerBaseUrl = mockWebServer.url("/").url().toString();
		final WebClient webClient = WebClient.builder().baseUrl(mockWebServerBaseUrl).build();
		koodistoService = new KoodistoService(webClient);
	}

	@Test
	public void testFilterUnOfficialLanguage() throws JsonProcessingException {
		assertLanguages(KoodistoService.UNOFFICIAL_LANGUAGE);
	}

	@Test
	public void testFilterUnknownLanguage() throws JsonProcessingException {
		assertLanguages(KoodistoService.UNKNOWN_LANGUAGE);
	}

	@Test
	public void testFilterOtherLanguage() throws JsonProcessingException {
		assertLanguages(KoodistoService.OTHER_LANGUAGE);
	}

	@Test
	public void testFilterSignLanguage() throws JsonProcessingException {
		assertLanguages(KoodistoService.SIGN_LANGUAGE);
	}

	private void assertLanguages(final String shouldNotContain) throws JsonProcessingException {
		final List<LanguageDTO> languageDtos = koodistoService.allLanguages();
		assertEquals(2, languageDtos.size());
		assertFalse(languageDtos.stream().anyMatch(dto -> dto.code().equals(shouldNotContain)));
		assertTrue(languageDtos.stream().anyMatch(dto -> dto.code().equals("FI")));
		assertTrue(languageDtos.stream().anyMatch(dto -> dto.code().equals("SV")));
	}

}