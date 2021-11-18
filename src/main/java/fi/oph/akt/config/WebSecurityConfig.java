package fi.oph.akt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
				.formLogin().and()
				.authorizeRequests()

				.antMatchers(
						"/",
						"/akt",
						"/akt/",
						"/akt/*.html",
						"/akt/*.js",
						"/akt/*.js.map",
						"/akt/*.css",
						"/akt/*.css.map",
						"/akt/favicon.ico",
						"/akt/api/v1/translator/**"
				).permitAll()

				.antMatchers(
						"/akt/api/v1/admin/**"
				).access("hasRole('VIRKAILIJA')")

				.anyRequest().denyAll()
				.and()
				.exceptionHandling()
				.accessDeniedHandler(CustomAccessDeniedHandler.create())
		;
        // @formatter:on
	}

	@Bean
	public UserDetailsService userDetailsService() {
		// TODO Use cas!
		// @formatter:off
		UserDetails user = User.withDefaultPasswordEncoder()
				.username("user")
				.password("user")
				.roles("USER")
				.build();
		UserDetails admin = User.withDefaultPasswordEncoder()
				.username("admin")
				.password("admin")
				.roles("VIRKAILIJA")
				.build();
		// @formatter:on
		return new InMemoryUserDetailsManager(user, admin);
	}

}
