package fi.oph.akt.config.security;

import fi.oph.akt.config.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Profile("dev")
@Configuration
@EnableWebSecurity
public class WebSecurityConfigDev extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .csrf()
      .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
      .and()
      .formLogin()
      .and()
      .httpBasic()
      .and()
      .authorizeRequests()
      .antMatchers("/", "/**")
      .permitAll()
      .anyRequest()
      .denyAll()
      .and()
      .exceptionHandling()
      .accessDeniedHandler(CustomAccessDeniedHandler.create());
  }

  @Bean
  public UserDetailsService userDetailsService() {
    UserDetails user = User.withDefaultPasswordEncoder().username("user").password("user").roles("USER").build();

    UserDetails clerk = User
      .withDefaultPasswordEncoder()
      .username("clerk")
      .password("clerk")
      .roles("VIRKAILIJA")
      .build();

    return new InMemoryUserDetailsManager(user, clerk);
  }
}
