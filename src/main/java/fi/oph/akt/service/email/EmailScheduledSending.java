package fi.oph.akt.service.email;

import fi.oph.akt.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

@Component
@RequiredArgsConstructor
public class EmailScheduledSending {

	private static final Logger LOG = LoggerFactory.getLogger(EmailScheduledSending.class);

	private static final String FIXED_DELAY = "PT10S";

	private static final String INITIAL_DELAY = "PT10S";

	public static final int BATCH_SIZE = 10;

	@Resource
	private final EmailRepository emailRepository;

	@Resource
	private final EmailService emailService;

	// TODO Move constants to config?
	@Scheduled(fixedDelayString = FIXED_DELAY, initialDelayString = INITIAL_DELAY)
	@SchedulerLock(name = "pollEmailsToSend", lockAtLeastFor = FIXED_DELAY)
	public void pollEmailsToSend() {
		LOG.debug("pollEmailsToSend");
		final List<Long> emailsToSend = emailRepository.findEmailsToSend(PageRequest.of(0, BATCH_SIZE));
		LOG.debug("emailsToSend.size {}", emailsToSend.size());
		emailsToSend.forEach(emailService::sendEmail);
	}

}
