package fi.oph.akt.config;

import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.access.AccessDeniedHandler;

public class CustomAccessDeniedHandler {

	private static final Logger LOG = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

	public static AccessDeniedHandler create() {
		return (request, response, e) -> {
			LOG.error("AccessDeniedHandler", e);
			if (!response.isCommitted()) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				response.setContentType("application/json");
				response.getWriter().print("{\"status\": \"FORBIDDEN\"}");
				response.getWriter().flush();
				response.getWriter().close();
			}
		};
	}

}
