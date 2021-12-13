package fi.oph.akt.service.email.sender;

import fi.oph.akt.service.email.EmailData;

public interface EmailSender {

	void sendEmail(EmailData emailData);

}
