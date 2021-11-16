package fi.oph.akt.api.search;

import javax.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/search", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
public class SearchController {

	@Resource
	private SearchService searchService;

	@GetMapping(path = "")
	public Page<TranslatorDTO> listAll(@PageableDefault(size = 10_000) Pageable pageable) {
		return searchService.listAll(pageable);
	}

}
