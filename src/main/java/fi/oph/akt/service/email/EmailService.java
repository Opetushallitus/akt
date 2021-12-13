package fi.oph.akt.service.email;

import fi.oph.akt.model.Email;
import fi.oph.akt.repository.EmailRepository;
import fi.oph.akt.service.email.sender.EmailSender;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

	private static final Logger LOG = LoggerFactory.getLogger(EmailService.class);

	@Resource
	private final EmailRepository emailRepository;

	@Resource
	private final EmailSender emailSender;

	@Transactional
	public Long saveEmail(final EmailData emailData) {
		final Email email = new Email();
		emailData.copyToEmail(email);
		return emailRepository.saveAndFlush(email).getId();
	}

	@Transactional
	public void sendEmail(final long emailId) {
		LOG.debug("Going to send email id:{}", emailId);
		final Email email = emailRepository.getById(emailId);
		try {
			final EmailData emailData = EmailData.createFromEmail(email);
			emailSender.sendEmail(emailData);
			email.setSentAt(LocalDateTime.now());
		}
		catch (final Exception e) {
			LOG.error("Exception when sending email", e);
			email.setError(e.getMessage());
		}
	}

}
