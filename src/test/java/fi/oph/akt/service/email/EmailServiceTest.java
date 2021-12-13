package fi.oph.akt.service.email;

import fi.oph.akt.Factory;
import fi.oph.akt.model.Email;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.repository.EmailRepository;
import fi.oph.akt.service.email.sender.EmailSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.annotation.Resource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@DataJpaTest
class EmailServiceTest {

	private EmailService emailService;

	@Resource
	private EmailRepository emailRepository;

	@MockBean
	private EmailSender emailSenderMock;

	@Resource
	private TestEntityManager entityManager;

	@Captor
	private ArgumentCaptor<EmailData> emailDataCaptor;

	@BeforeEach
	public void setup() {
		emailService = new EmailService(emailRepository, emailSenderMock);
	}

	@Test
	public void testMailIsSaved() {
		final EmailData emailData = EmailData.builder().type(EmailType.CONTACT_REQUEST).sender("lähettäjä")
				.recipient("vastaanottaja@invalid").subject("testiotsikko").body("testiviesti").build();
		final Long savedId = emailService.saveEmail(emailData);

		final List<Email> all = emailRepository.findAll();
		assertEquals(1, all.size());

		final Email persistedEmail = all.get(0);
		assertEquals(savedId, persistedEmail.getId());
		assertEquals("lähettäjä", persistedEmail.getSender());
		assertEquals("vastaanottaja@invalid", persistedEmail.getRecipient());
		assertEquals("testiotsikko", persistedEmail.getSubject());
		assertEquals("testiviesti", persistedEmail.getBody());
		assertNull(persistedEmail.getSentAt());
		assertNull(persistedEmail.getError());
	}

	@Test
	public void testMailIsSent() {
		final Email email = Factory.email(EmailType.CONTACT_REQUEST);
		final Email savedEmail = entityManager.persist(email);

		emailService.sendEmail(savedEmail.getId());

		final Email updatedEmail = emailRepository.getById(savedEmail.getId());
		assertNotNull(updatedEmail.getSentAt());
		assertNull(updatedEmail.getError());

		verify(emailSenderMock).sendEmail(emailDataCaptor.capture());
		assertEquals(savedEmail.getSender(), emailDataCaptor.getValue().sender());
		assertEquals(savedEmail.getRecipient(), emailDataCaptor.getValue().recipient());
		assertEquals(savedEmail.getSubject(), emailDataCaptor.getValue().subject());
		assertEquals(savedEmail.getBody(), emailDataCaptor.getValue().body());
	}

	@Test
	public void testMailSendingFailed() {
		final Email email = Factory.email(EmailType.CONTACT_REQUEST);
		final Email savedEmail = entityManager.persist(email);

		doThrow(new RuntimeException("error msg")).when(emailSenderMock).sendEmail(any());

		emailService.sendEmail(savedEmail.getId());

		final Email updatedEmail = emailRepository.getById(savedEmail.getId());
		assertNull(updatedEmail.getSentAt());
		assertEquals("error msg", updatedEmail.getError());
	}

}