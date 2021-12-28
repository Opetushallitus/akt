package fi.oph.akt.api.clerk;

import fi.oph.akt.api.dto.ClerkTranslatorDTO;
import fi.oph.akt.service.ClerkTranslatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/clerk/translator", produces = MediaType.APPLICATION_JSON_VALUE)
public class ClerkTranslatorController {

	@Resource
	private ClerkTranslatorService clerkTranslatorService;

	@GetMapping(path = "")
	public List<ClerkTranslatorDTO> list(@RequestParam(required = false) Integer size) {
		if (size != null && size < 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}

		List<ClerkTranslatorDTO> translators = clerkTranslatorService.list();

		return size == null ? translators : translators.subList(0, Math.min(size, translators.size()));
	}

}
