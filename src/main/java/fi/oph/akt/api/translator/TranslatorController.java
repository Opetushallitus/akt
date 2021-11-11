package fi.oph.akt.api.translator;

import javax.annotation.Resource;

import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.service.TranslatorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/translator", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
public class TranslatorController {

	@Resource
	private TranslatorService translatorService;

	@GetMapping(path = "")
	public Page<PublicTranslatorDTO> listAll(@PageableDefault(size = 10_000) Pageable pageable) {
		return translatorService.listPublicTranslators(pageable);
	}

}
