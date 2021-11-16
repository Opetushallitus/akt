package fi.oph.akt.api.admin;

import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/admin", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminController {

	@GetMapping(path = "/hello")
	public Map<String, String> hello() {
		return Map.of("admin", "api hello");
	}

}
