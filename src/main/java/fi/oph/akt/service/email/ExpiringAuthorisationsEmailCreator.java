package fi.oph.akt.service.email;

import fi.oph.akt.repository.AuthorisationTermRepository;
import lombok.RequiredArgsConstructor;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class ExpiringAuthorisationsEmailCreator {

	private static final Logger LOG = LoggerFactory.getLogger(ExpiringAuthorisationsEmailCreator.class);

	private static final String FIXED_DELAY = "PT1M"; // TODO: change to "PT12H"

	private static final String INITIAL_DELAY = "PT1S"; // TODO: change to "PT1H"

	private static final String LOCK_AT_LEAST = "PT10S";

	private static final String LOCK_AT_MOST = "PT2H";

	@Resource
	private final AuthorisationTermRepository termRepository;

	@Resource
	private final ClerkEmailService clerkEmailService;

	@Scheduled(fixedDelayString = FIXED_DELAY, initialDelayString = INITIAL_DELAY)
	@SchedulerLock(name = "pollExpiringAuthorisations", lockAtLeastFor = LOCK_AT_LEAST, lockAtMostFor = LOCK_AT_MOST)
	public void pollExpiringAuthorisations() {
		LOG.debug("pollExpiringAuthorisations");
		final LocalDate expiryStart = LocalDate.now();
		final LocalDate expiryEnd = expiryStart.plusMonths(3);
		final long maxReminderCount = 0;

		termRepository.findAuthorisationTermsExpiringBetween(expiryStart, expiryEnd, maxReminderCount)
				.forEach(clerkEmailService::createAuthorisationExpiryEmail);
	}

}
