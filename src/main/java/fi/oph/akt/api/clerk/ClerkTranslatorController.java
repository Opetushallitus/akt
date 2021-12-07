package fi.oph.akt.api.clerk;

import fi.oph.akt.api.dto.ClerkTranslatorDTO;
import fi.oph.akt.service.ClerkTranslatorService;
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
@RequestMapping(value = "/api/v1/clerk/translator", produces = MediaType.APPLICATION_JSON_VALUE)
public class ClerkTranslatorController {

	@Resource
	private ClerkTranslatorService clerkTranslatorService;

	@GetMapping(path = "")
	public Page<ClerkTranslatorDTO> list(@RequestParam(required = false) Integer size,
			@RequestParam(required = false) Integer page,
			@Parameter(hidden = true) @PageableDefault(size = 10_000) Pageable pageable) {

		return clerkTranslatorService.list(pageable);
	}

}
