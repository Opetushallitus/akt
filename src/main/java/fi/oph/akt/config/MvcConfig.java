package fi.oph.akt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("redirect:/akt");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// @formatter:off
		registry.addResourceHandler(
				"/akt/**/*.js",
				"/akt/**/*.js.map",
				"/akt/**/*.css",
				"/akt/**/*.css.map",
				"/akt/**/*.ico",
				"/akt/**/*.woff",
				"/akt/**/*.woff2",
				"/akt/**/*.svg"
		).addResourceLocations("classpath:static/");
		// @formatter:on
	}

}