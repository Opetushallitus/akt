package fi.oph.akt.model;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "email")
public class Email extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "email_id", nullable = false)
	private long id;

	@Column(name = "sender", nullable = false, length = -1)
	private String sender;

	@Column(name = "recipient", nullable = false, length = -1)
	private String recipient;

	@Column(name = "subject", nullable = false, length = -1)
	private String subject;

	@Column(name = "body", nullable = false, length = -1)
	private String body;

	@Column(name = "sent_at")
	private Instant sent;

	@Column(name = "error", length = -1)
	private String error;

	public long getId() {
		return id;
	}

	public void setId(final long emailId) {
		this.id = emailId;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(final String sender) {
		this.sender = sender;
	}

	public String getRecipient() {
		return recipient;
	}

	public void setRecipient(final String recipient) {
		this.recipient = recipient;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(final String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return body;
	}

	public void setBody(final String body) {
		this.body = body;
	}

	public Instant getSent() {
		return sent;
	}

	public void setSent(final Instant sent) {
		this.sent = sent;
	}

	public String getError() {
		return error;
	}

	public void setError(final String error) {
		this.error = error;
	}

}
