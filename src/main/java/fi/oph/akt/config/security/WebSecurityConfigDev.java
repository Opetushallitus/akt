package fi.oph.akt.config.security;

import fi.oph.akt.config.CustomAccessDeniedHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

@Profile("dev")
@Configuration
@EnableWebSecurity
public class WebSecurityConfigDev extends WebSecurityConfigurerAdapter {

  private static final Logger LOG = LoggerFactory.getLogger(WebSecurityConfigDev.class);

  @Value("${dev.web.security.off:false}")
  private Boolean devWebSecurityOff;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    if (devWebSecurityOff) {
      LOG.warn("Web security is OFF");
      WebSecurityConfig
        .configCsrf(http)
        .authorizeRequests()
        .antMatchers("/", "/**")
        .permitAll()
        .anyRequest()
        .authenticated();
      return;
    }
    WebSecurityConfig
      .commonConfig(http)
      // formLogin and httpBasic enabled for development, testing APIs manually is easier.
      .formLogin()
      .and()
      .httpBasic()
      .and()
      .exceptionHandling()
      .accessDeniedHandler(CustomAccessDeniedHandler.create());
  }

  @Bean
  public UserDetailsService userDetailsService() {
    if (devWebSecurityOff) {
      return new InMemoryUserDetailsManager();
    }
    UserDetails user = User.withDefaultPasswordEncoder().username("user").password("user").roles("USER").build();

    UserDetails clerk = User
      .withDefaultPasswordEncoder()
      .username("clerk")
      .password("clerk")
      .roles(WebSecurityConfig.AKT_ROLE)
      .build();

    return new InMemoryUserDetailsManager(user, clerk);
  }
}
