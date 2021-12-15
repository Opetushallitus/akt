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

	@Transactional
	public ContactRequest createContactRequest(ContactRequestDTO contactRequestDTO) {
		final List<Long> translatorIds = contactRequestDTO.translatorIds().stream().distinct().toList();

		final List<Translator> translators = translatorRepository.findAllById(translatorIds);

		if (translators.size() == translatorIds.size()) {
			ContactRequest contactRequest = makeContactRequest(contactRequestDTO);
			ContactRequest savedContactRequest = contactRequestRepository.save(contactRequest);

			List<ContactRequestTranslator> contactRequestTranslators = makeContactRequestTranslators(translators,
					savedContactRequest);
			contactRequestTranslatorRepository.saveAll(contactRequestTranslators);

			// TODO (OPHAKTKEH-114): create email

			return savedContactRequest;
		}
		else {
			throw new IllegalArgumentException("Each translator by provided translatorIds not found");
		}
	}

	private ContactRequest makeContactRequest(ContactRequestDTO contactRequestDTO) {
		ContactRequest contactRequest = new ContactRequest();

		contactRequest.setFirstName(contactRequestDTO.firstName());
		contactRequest.setLastName(contactRequestDTO.lastName());
		contactRequest.setEmail(contactRequestDTO.email());
		contactRequest.setPhoneNumber(contactRequestDTO.phoneNumber());
		contactRequest.setMessage(contactRequestDTO.message());
		contactRequest.setFromLang(contactRequestDTO.fromLang());
		contactRequest.setToLang(contactRequestDTO.toLang());

		return contactRequest;
	}

	private List<ContactRequestTranslator> makeContactRequestTranslators(List<Translator> translators,
			ContactRequest contactRequest) {

		return translators.stream().map(translator -> {
			ContactRequestTranslator contactRequestTranslator = new ContactRequestTranslator();
			contactRequestTranslator.setContactRequest(contactRequest);
			contactRequestTranslator.setTranslator(translator);

			return contactRequestTranslator;
		}).toList();
	}

}
