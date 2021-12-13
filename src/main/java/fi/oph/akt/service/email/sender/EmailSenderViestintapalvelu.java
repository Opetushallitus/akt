package fi.oph.akt.service.email.sender;

import fi.oph.akt.service.email.EmailData;
import java.util.List;
import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Profile("!dev")
@Component
public class EmailSenderViestintapalvelu implements EmailSender {

	private static final Logger LOG = LoggerFactory.getLogger(EmailSenderViestintapalvelu.class);

	@Value("${akt.ryhmasahkoposti-service-url}")
	private String emailServiceUrl;

	@Override
	public void sendEmail(final EmailData emailData) {
		try {
			LOG.info("emailServiceUrl:{}", emailServiceUrl);

			final WebClient webClient = WebClient.builder().baseUrl(emailServiceUrl)
					.defaultHeader("Caller-Id", "1.2.246.562.10.00000000001.akt").build();

			final JSONObject email = new JSONObject();
			email.put("html", true);
			email.put("charset", "UTF-8");

			email.put("sender", emailData.sender());
			email.put("subject", emailData.subject());
			email.put("body", emailData.body());

			final JSONObject recipient = new JSONObject();
			recipient.put("email", emailData.recipient());

			final JSONObject data = new JSONObject();
			data.put("email", email);
			data.put("recipient", List.of(recipient));

			final Mono<String> response = webClient.post().contentType(MediaType.APPLICATION_JSON).bodyValue(data)
					.retrieve().bodyToMono(String.class);
			LOG.info("WebClient response:{}", response.block());
			// e.g. {"id":"2428166"}
		}
		catch (Exception e) {
			LOG.error("Exception with WebClient", e);
		}
	}

}
