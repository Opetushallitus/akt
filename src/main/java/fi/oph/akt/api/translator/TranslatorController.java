package fi.oph.akt.api.translator;

import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.service.PublicTranslatorService;
import io.swagger.v3.oas.annotations.Parameter;
import javax.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/translator", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
public class TranslatorController {

	@Resource
	private PublicTranslatorService publicTranslatorService;

	@GetMapping(path = "")
	public Page<PublicTranslatorDTO> listAll(@RequestParam(required = false) Integer size,
			@RequestParam(required = false) Integer page,
			@Parameter(hidden = true) @PageableDefault(size = 10_000) Pageable pageable) {

		return publicTranslatorService.list(pageable);
	}

}
