package fi.oph.akt.util;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class TemplateRenderer {

	@Resource(name = "emailTemplateEngine")
	private TemplateEngine emailTemplateEngine;

	public String renderContactRequestEmailBody(Map<String, Object> params) {
		Context context = new Context();
		context.setVariables(params);

		return emailTemplateEngine.process("contact-request", context);
	}

}
