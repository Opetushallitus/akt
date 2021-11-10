package fi.oph.akt.model;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "email")
public class Email extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "email_id", nullable = false)
	private long id;

	@Column(name = "sender", nullable = false)
	private String sender;

	@Column(name = "recipient", nullable = false)
	private String recipient;

	@Column(name = "subject", nullable = false)
	private String subject;

	@Column(name = "body", nullable = false)
	private String body;

	@Column(name = "sent_at")
	private LocalDateTime sentAt;

	@Column(name = "error")
	private String error;

}
