package fi.oph.akt.service;

import fi.oph.akt.api.dto.ContactRequestDTO;
import fi.oph.akt.model.ContactRequest;
import fi.oph.akt.model.ContactRequestTranslator;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.ContactRequestRepository;
import fi.oph.akt.repository.ContactRequestTranslatorRepository;
import fi.oph.akt.repository.LanguagePairRepository;
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
	private LanguagePairRepository languagePairRepository;

	@Resource
	private TranslatorRepository translatorRepository;

	@Transactional
	public ContactRequest createContactRequest(ContactRequestDTO contactRequestDTO) {
		final List<Long> distinctTranslatorIds = contactRequestDTO.translatorIds().stream().distinct().toList();
		final List<Translator> translators = translatorRepository.findAllById(distinctTranslatorIds);

		validateContactRequestDTO(contactRequestDTO, distinctTranslatorIds, translators);

		ContactRequest contactRequest = saveContactRequest(contactRequestDTO);
		saveContactRequestTranslators(translators, contactRequest);

		// TODO (OPHAKTKEH-114): create email

		return contactRequest;
	}

	private void validateContactRequestDTO(ContactRequestDTO contactRequestDTO, List<Long> translatorIds,
			List<Translator> translators) {

		List<String> fromLangs = languagePairRepository.getDistinctFromLangs();
		List<String> toLangs = languagePairRepository.getDistinctToLangs();

		if (translators.size() != translatorIds.size()) {
			throw new IllegalArgumentException("Each translator by provided translatorIds not found");
		}
		else if (!fromLangs.contains(contactRequestDTO.fromLang())) {
			throw new IllegalArgumentException("Invalid fromLang " + contactRequestDTO.fromLang());
		}
		else if (!toLangs.contains(contactRequestDTO.toLang())) {
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

}
