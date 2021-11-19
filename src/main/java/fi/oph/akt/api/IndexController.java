package fi.oph.akt.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/akt")
public class IndexController {

	@GetMapping("")
	public ModelAndView index() {
		return new ModelAndView("index.html");
	}

	// Map to everything which has no suffix, i.e. matches to "/akt/foo/bar" but not to
	// "/akt/foo/bar.js"
	@GetMapping("/**/{path:[^.]*}")
	public ModelAndView indexAllOtherPaths() {
		return new ModelAndView("index.html");
	}

}
