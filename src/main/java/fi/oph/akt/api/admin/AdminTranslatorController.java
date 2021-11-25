package fi.oph.akt.api.admin;

import fi.oph.akt.api.dto.TranslatorDTO;
import fi.oph.akt.service.TranslatorService;
import io.swagger.v3.oas.annotations.Parameter;
import javax.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/admin/translator", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminTranslatorController {

	@Resource
	private TranslatorService translatorService;

	@GetMapping(path = "")
	public Page<TranslatorDTO> listTranslators(@RequestParam(required = false) Integer size,
			@RequestParam(required = false) Integer page,
			@Parameter(hidden = true) @PageableDefault(size = 10_000) Pageable pageable) {

		return translatorService.listTranslators(pageable);
	}

}
