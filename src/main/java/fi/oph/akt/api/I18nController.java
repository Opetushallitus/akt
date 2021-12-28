package fi.oph.akt.api;

import fi.oph.akt.api.dto.LanguageDTO;
import fi.oph.akt.api.dto.LocaleDTO;
import fi.oph.akt.service.LanguageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/i18n", produces = MediaType.APPLICATION_JSON_VALUE)
public class I18nController {

	@Resource
	private LanguageService languageService;

	@GetMapping(path = "/languages")
	public Map<LocaleDTO, List<LanguageDTO>> listLanguageTranslations() {
		return languageService.allLanguages();
	}

}
