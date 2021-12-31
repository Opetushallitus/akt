package fi.oph.akt.service;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.LanguagePair;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.onr.OnrServiceMock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Import({ ClerkTranslatorService.class, OnrServiceMock.class })
class ClerkTranslatorServiceTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private ClerkTranslatorService clerkTranslatorService;

	@Test
	public void listShouldReturnAllTranslators() {
		final MeetingDate meetingDate = Factory.meetingDate();
		entityManager.persist(meetingDate);

		IntStream.range(0, 3).forEach(n -> createTranslator(meetingDate));

		final ClerkTranslatorResponseDTO responseDTO = clerkTranslatorService.listTranslators();
		List<ClerkTranslatorDTO> translators = responseDTO.translators();

		assertEquals(3, translators.size());
	}

	private void createTranslator(final MeetingDate meetingDate) {

		final Translator translator = Factory.translator();
		final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
		final LanguagePair languagePair = Factory.languagePair(authorisation);
		final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

		entityManager.persist(translator);
		entityManager.persist(authorisation);
		entityManager.persist(languagePair);
		entityManager.persist(authorisationTerm);
	}

}
