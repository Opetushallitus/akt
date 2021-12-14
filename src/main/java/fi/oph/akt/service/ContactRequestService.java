package fi.oph.akt.service;

import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestRepository;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.TranslatorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ContactRequestService {

	@Resource
	private ContactRequestRepository contactRequestRepository;

	@Resource
	private ContactRequestTranslatorRepository contactRequestTranslatorRepository;

	@Resource
	private TranslatorRepository translatorRepository;

	@Transactional(noRollbackFor = IllegalArgumentException.class)
	public ContactRequest createContactRequest(ContactRequestDTO contactRequestDTO) {
		final List<Translator> translators = translatorRepository.findAllById(contactRequestDTO.translatorIds());

		if (translators.size() == contactRequestDTO.translatorIds().size()) {
			ContactRequest contactRequest = new ContactRequest();

			contactRequest.setFirstName(contactRequestDTO.firstName());
			contactRequest.setLastName(contactRequestDTO.lastName());
			contactRequest.setEmail(contactRequestDTO.email());
			contactRequest.setPhoneNumber(contactRequestDTO.phoneNumber());
			contactRequest.setMessage(contactRequestDTO.message());

			ContactRequest savedContactRequest = contactRequestRepository.save(contactRequest);

			List<ContactRequestTranslator> contactRequestTranslators = translators.stream().map(t -> {
				ContactRequestTranslator contactRequestTranslator = new ContactRequestTranslator();
				contactRequestTranslator.setContactRequest(savedContactRequest);
				contactRequestTranslator.setTranslator(t);

				return contactRequestTranslator;
			}).toList();

			contactRequestTranslatorRepository.saveAll(contactRequestTranslators);

			return savedContactRequest;
		}
		else {
			throw new IllegalArgumentException("Each translator by provided translatorIds not found");
		}
	}

}
