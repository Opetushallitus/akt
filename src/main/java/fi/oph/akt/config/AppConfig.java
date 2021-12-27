package fi.oph.akt.config;

import fi.oph.akt.service.LanguageService;
import fi.oph.akt.service.email.sender.EmailSender;
import fi.oph.akt.service.email.sender.EmailSenderNoOp;
import fi.oph.akt.service.email.sender.EmailSenderViestintapalvelu;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {

	private static final Logger LOG = LoggerFactory.getLogger(AppConfig.class);

	@Bean
	@ConditionalOnProperty(name = "akt.email.sending-enabled", havingValue = "false")
	public EmailSender emailSenderNoOp() {
		LOG.warn("EmailSenderNoOp in use");
		return new EmailSenderNoOp();
	}

	@Bean
	@ConditionalOnProperty(name = "akt.email.sending-enabled", havingValue = "true")
	public EmailSender emailSender(@Value("${akt.email.ryhmasahkoposti-service-url}") String emailServiceUrl) {
		LOG.info("emailServiceUrl:{}", emailServiceUrl);
		final WebClient webClient = webClientBuilderWithCallerId().baseUrl(emailServiceUrl).build();
		return new EmailSenderViestintapalvelu(webClient);
	}

	@Bean
	public LanguageService languageService(@Value("${akt.koodisto.languages-url}") String koodistoLanguagesUrl) {
		LOG.info("koodistoLanguagesUrl:{}", koodistoLanguagesUrl);
		final WebClient webClient = webClientBuilderWithCallerId().baseUrl(koodistoLanguagesUrl).build();
		return new LanguageService(webClient);
	}

	private static WebClient.Builder webClientBuilderWithCallerId() {
		return WebClient.builder().defaultHeader("Caller-Id", "1.2.246.562.10.00000000001.akt");
	}

}
