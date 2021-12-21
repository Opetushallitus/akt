package fi.oph.akt.service;

import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.EmailType;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestRepository;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.service.email.EmailData;
import fi.oph.akt.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

	@Resource
	private final ContactRequestRepository contactRequestRepository;

	@Resource
	private final ContactRequestTranslatorRepository contactRequestTranslatorRepository;

	@Resource
	private final EmailService emailService;

	@Resource
	private final LanguagePairRepository languagePairRepository;

	@Resource
	private final TranslatorRepository translatorRepository;

	@Transactional
	public ContactRequest createContactRequest(ContactRequestDTO contactRequestDTO) {
		final List<Long> distinctTranslatorIds = contactRequestDTO.translatorIds().stream().distinct().toList();
		final List<Translator> translators = translatorRepository.findAllById(distinctTranslatorIds);

		validateContactRequestDTO(contactRequestDTO, distinctTranslatorIds, translators);

		ContactRequest contactRequest = saveContactRequest(contactRequestDTO);
		saveContactRequestTranslators(translators, contactRequest);
		saveContactRequestEmails(contactRequestDTO, translators);

		return contactRequest;
	}

	private void validateContactRequestDTO(ContactRequestDTO contactRequestDTO, List<Long> translatorIds,
			List<Translator> translators) {

		if (translators.size() != translatorIds.size()) {
			throw new IllegalArgumentException("Each translator by provided translatorIds not found");
		}

		List<String> fromLangs = languagePairRepository.getDistinctFromLangs();
		if (!fromLangs.contains(contactRequestDTO.fromLang())) {
			throw new IllegalArgumentException("Invalid fromLang " + contactRequestDTO.fromLang());
		}

		List<String> toLangs = languagePairRepository.getDistinctToLangs();
		if (!toLangs.contains(contactRequestDTO.toLang())) {
			throw new IllegalArgumentException("Invalid toLang " + contactRequestDTO.toLang());
		}
	}

	private ContactRequest saveContactRequest(ContactRequestDTO contactRequestDTO) {
		ContactRequest contactRequest = new ContactRequest();

		contactRequest.setFirstName(contactRequestDTO.firstName());
		contactRequest.setLastName(contactRequestDTO.lastName());
		contactRequest.setEmail(contactRequestDTO.email());
		contactRequest.setPhoneNumber(contactRequestDTO.phoneNumber());
		contactRequest.setMessage(contactRequestDTO.message());
		contactRequest.setFromLang(contactRequestDTO.fromLang());
		contactRequest.setToLang(contactRequestDTO.toLang());

		return contactRequestRepository.save(contactRequest);
	}

	private void saveContactRequestTranslators(List<Translator> translators, ContactRequest contactRequest) {

		List<ContactRequestTranslator> contactRequestTranslators = translators.stream().map(translator -> {
			ContactRequestTranslator contactRequestTranslator = new ContactRequestTranslator();
			contactRequestTranslator.setContactRequest(contactRequest);
			contactRequestTranslator.setTranslator(translator);

			return contactRequestTranslator;
		}).toList();

		contactRequestTranslatorRepository.saveAll(contactRequestTranslators);
	}

	private void saveContactRequestEmails(ContactRequestDTO contactRequestDTO, List<Translator> translators) {
		// @formatter:off
		String phoneNumber = contactRequestDTO.phoneNumber() != null ? contactRequestDTO.phoneNumber() : "";

		String emailBody = contactRequestDTO.message().trim() + "\n\n" +
				"Lähettäjän yhteystiedot\n" +
				"-----------------------\n" +
				contactRequestDTO.firstName() + " " + contactRequestDTO.lastName() + "\n" +
				contactRequestDTO.email() + "\n" +
				phoneNumber;

		translators.forEach(translator -> {
			// TODO: replace recipient with translator's email address
			EmailData emailData = EmailData.builder()
					.sender("auktoris@oph.fi")
					.recipient("translator" + translator.getId() + "@test.fi")
					.subject("Yhteydenotto kääntäjärekisteristä")
					.body(emailBody.trim()).build();

			emailService.saveEmail(EmailType.CONTACT_REQUEST, emailData);
		});
		// @formatter:on
	}

}
