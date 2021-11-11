package fi.oph.akt.api.search;

import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
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
	public List<TranslatorDTO> listAll() {
		return searchService.listAll();
	}

	@GetMapping(path = "/one")
	public Map<String, String> getOne() {
		return Map.of("Hello", "one World!");
	}

}
