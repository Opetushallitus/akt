package fi.oph.akt.service.email;

import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import lombok.Builder;
import lombok.NonNull;

public record EmailData(@NonNull EmailType type, @NonNull String sender, @NonNull String recipient,
		@NonNull String subject, @NonNull String body) {
	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public EmailData {
	}

	public static EmailData createFromEmail(final Email email) {
		// @formatter:off
		return EmailData.builder()
				.type(email.getEmailType())
				.sender(email.getSender())
				.recipient(email.getRecipient())
				.subject(email.getSubject())
				.body(email.getBody()).build();
        // @formatter:on
	}

	public void copyToEmail(final Email email) {
		email.setEmailType(this.type());
		email.setSender(this.sender());
		email.setRecipient(this.recipient());
		email.setSubject(this.subject());
		email.setBody(this.body());
	}
}
