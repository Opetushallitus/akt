package fi.oph.akt.service.email.sender;

import com.fasterxml.jackson.core.JsonProcessingException;
import fi.oph.akt.service.email.EmailData;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.json.BasicJsonTester;
import org.springframework.boot.test.json.JsonContent;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import static junit.framework.TestCase.assertEquals;
import static org.assertj.core.api.Assertions.assertThat;

class EmailSenderViestintapalveluTest {

	private EmailSenderViestintapalvelu sender;

	private MockWebServer mockWebServer;

	private final BasicJsonTester json = new BasicJsonTester(this.getClass());

	@BeforeEach
	public void setup() {
		mockWebServer = new MockWebServer();
		final String mockWebServerBaseUrl = mockWebServer.url("/").url().toString();
		sender = new EmailSenderViestintapalvelu(WebClient.builder().baseUrl(mockWebServerBaseUrl).build());
	}

	@Test
	public void test() throws JsonProcessingException, InterruptedException {
		mockWebServer.enqueue(new MockResponse().setResponseCode(200)
				.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).setBody("{\"id\":\"12345\"}"));

		final EmailData emailData = EmailData.builder().sender("lähettäjä").recipient("vastaanottaja@invalid")
				.subject("testiotsikko").body("testiviesti").build();

		final String senderId = sender.sendEmail(emailData);
		assertEquals("12345", senderId);

		final RecordedRequest request = mockWebServer.takeRequest();
		final String source = request.getBody().readUtf8();
		final JsonContent<Object> body = json.from(source);

		assertThat(body).extractingJsonPathBooleanValue("$.email.html").isEqualTo(true);
		assertThat(body).extractingJsonPathStringValue("$.email.charset").isEqualTo("UTF-8");
		assertThat(body).extractingJsonPathStringValue("$.email.sender").isEqualTo("lähettäjä");
		assertThat(body).extractingJsonPathStringValue("$.email.subject").isEqualTo("testiotsikko");
		assertThat(body).extractingJsonPathStringValue("$.email.body").isEqualTo("testiviesti");
		assertThat(body).extractingJsonPathArrayValue("$.recipient").size().isEqualTo(1);
		assertThat(body).extractingJsonPathStringValue("$.recipient[0].email").isEqualTo("vastaanottaja@invalid");
	}

}