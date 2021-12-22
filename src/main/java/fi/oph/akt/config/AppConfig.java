package fi.oph.akt.config;

import fi.oph.akt.service.email.sender.EmailSender;
import fi.oph.akt.service.email.sender.EmailSenderNoOp;
import fi.oph.akt.service.email.sender.EmailSenderViestintapalvelu;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;

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
		final WebClient webClient = WebClient.builder().baseUrl(emailServiceUrl)
				.defaultHeader("Caller-Id", "1.2.246.562.10.00000000001.akt").build();
		return new EmailSenderViestintapalvelu(webClient);
	}

	@Bean(name = "templateEngine")
	public SpringTemplateEngine templateEngine(final ApplicationContext applicationContext) {
		// SpringResourceTemplateResolver automatically integrates with Spring's own
		// resource resolution infrastructure, which is highly recommended.
		final SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();

		templateResolver.setApplicationContext(applicationContext);
		templateResolver.setPrefix("classpath:/static/");
		templateResolver.setSuffix(".html");
		templateResolver.setTemplateMode(TemplateMode.HTML);

		// SpringTemplateEngine automatically applies SpringStandardDialect and
		// enables Spring's own MessageSource message resolution mechanisms.
		final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
		templateEngine.setTemplateResolver(templateResolver);

		// Enabling the SpringEL compiler with Spring 4.2.4 or newer can
		// speed up execution in most scenarios, but might be incompatible
		// with specific cases when expressions in one template are reused
		// across different data types, so this flag is "false" by default
		// for safer backwards compatibility.
		templateEngine.setEnableSpringELCompiler(true);
		return templateEngine;
	}

}
