package fi.oph.akt.service.email.sender;

import fi.oph.akt.service.email.EmailData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("dev")
@Component
public class EmailSenderNoOp implements EmailSender {

	private static final Logger LOG = LoggerFactory.getLogger(EmailSenderNoOp.class);

	@Override
	public void sendEmail(final EmailData emailData) {
		LOG.info("{}", emailData);
	}

}
