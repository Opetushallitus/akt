package fi.oph.akt.config;

import fi.oph.akt.service.email.sender.EmailSender;
import fi.oph.akt.service.email.sender.EmailSenderNoOp;
import fi.oph.akt.service.email.sender.EmailSenderViestintapalvelu;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {

	private static final Logger LOG = LoggerFactory.getLogger(AppConfig.class);

	@Profile("dev")
	@Bean
	public EmailSender emailSenderNoOp() {
		return new EmailSenderNoOp();
	}

	@Profile("!dev")
	@Bean
	public EmailSender emailSender(@Value("${akt.ryhmasahkoposti-service-url}") String emailServiceUrl) {
		LOG.info("emailServiceUrl:{}", emailServiceUrl);
		final WebClient webClient = WebClient.builder().baseUrl(emailServiceUrl)
				.defaultHeader("Caller-Id", "1.2.246.562.10.00000000001.akt").build();
		return new EmailSenderViestintapalvelu(webClient);
	}

}
