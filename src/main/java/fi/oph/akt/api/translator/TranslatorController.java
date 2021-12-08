package fi.oph.akt.api.translator;

import fi.oph.akt.api.dto.PublicTranslatorDTO;
import fi.oph.akt.service.PublicTranslatorService;
import javax.annotation.Resource;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/translator", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
public class TranslatorController {

	@Resource
	private PublicTranslatorService publicTranslatorService;

	@GetMapping(path = "")
	public List<PublicTranslatorDTO> list(@RequestParam(required = false) Integer size) {
		if (size != null && size < 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}

		List<PublicTranslatorDTO> translators = publicTranslatorService.list();

		return size == null ? translators : translators.subList(0, Math.min(size, translators.size()));
	}

}
