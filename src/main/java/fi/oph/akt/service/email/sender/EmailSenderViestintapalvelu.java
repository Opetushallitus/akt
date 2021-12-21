package fi.oph.akt.service.email.sender;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.oph.akt.service.email.EmailData;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class EmailSenderViestintapalvelu implements EmailSender {

	private static final Logger LOG = LoggerFactory.getLogger(EmailSenderViestintapalvelu.class);

	private final WebClient webClient;

	@Override
	public String sendEmail(final EmailData emailData) throws JsonProcessingException {
		final Map<String, Object> email = new HashMap<>();
		email.put("html", true);
		email.put("charset", "UTF-8");

		email.put("sender", emailData.sender());
		email.put("subject", emailData.subject());
		email.put("body", emailData.body());

		final Map<String, Object> recipient = new HashMap<>();
		recipient.put("email", emailData.recipient());

		final Map<String, Object> data = new HashMap<>();
		data.put("email", email);
		data.put("recipient", List.of(recipient));
		LOG.debug("Data:{}", data);

		final Mono<String> response = webClient.post().contentType(MediaType.APPLICATION_JSON).bodyValue(data)
				.retrieve().bodyToMono(String.class);
		final String result = response.block();
		LOG.debug("WebClient response:{}", result);

		final ObjectMapper mapper = new ObjectMapper();
		final Map<String, String> map = mapper.readValue(result, new TypeReference<>() {
		});
		return map.get("id");
	}

}
