package fi.oph.akt.util;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class TemplateRenderer {

	@Resource(name = "templateEngine")
	private TemplateEngine templateEngine;

	public String renderContactRequestEmailBody(Map<String, Object> params) {
		Context context = new Context();
		context.setVariables(params);

		return templateEngine.process("contact-request", context);
	}

}
