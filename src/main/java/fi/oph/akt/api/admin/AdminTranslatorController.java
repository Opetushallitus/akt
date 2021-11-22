package fi.oph.akt.api.admin;

import fi.oph.akt.service.TranslatorService;
import fi.oph.akt.api.dto.TranslatorDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping(value = "/akt/api/v1/admin/translator", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminTranslatorController {

	@Resource
	private TranslatorService translatorService;

	@GetMapping(path = "")
	public Page<TranslatorDTO> listTranslators(@PageableDefault(size = 10_000) Pageable pageable) {
		return translatorService.listTranslators(pageable);
	}

}
