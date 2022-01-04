package fi.oph.akt.api.clerk;

import fi.oph.akt.api.dto.clerk.InformalEmailDTO;
import fi.oph.akt.service.ClerkTranslatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/v1/clerk/email", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmailController {

	@Resource
	private ClerkTranslatorService clerkTranslatorService;

	@PostMapping("/informal")
	@ResponseStatus(HttpStatus.CREATED)
	public void createInformalEmails(@Valid @RequestBody InformalEmailDTO emailDTO) {
		clerkTranslatorService.createInformalEmails(emailDTO.translatorIds(), emailDTO.subject(), emailDTO.body());
	}

}
