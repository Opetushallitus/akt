package fi.oph.akt.config;

import fi.vm.sade.java_utils.security.OpintopolkuCasAuthenticationFilter;
import fi.vm.sade.javautils.kayttooikeusclient.OphUserDetailsServiceImpl;
import org.jasig.cas.client.session.HashMapBackedSessionMappingStorage;
import org.jasig.cas.client.session.SessionMappingStorage;
import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.validation.Cas20ProxyTicketValidator;
import org.jasig.cas.client.validation.TicketValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAuthenticationProvider;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Profile("!dev")
@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = false, prePostEnabled = true, securedEnabled = true)
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  private Environment environment;
  private SessionMappingStorage sessionMappingStorage = new HashMapBackedSessionMappingStorage();

  @Autowired
  public WebSecurityConfig(Environment environment) {
    this.environment = environment;
  }

  @Bean
  public ServiceProperties serviceProperties() {
    ServiceProperties serviceProperties = new ServiceProperties();
    serviceProperties.setService(environment.getRequiredProperty("cas.service") + "/j_spring_cas_security_check");
    serviceProperties.setSendRenew(environment.getRequiredProperty("cas.send-renew", Boolean.class));
    serviceProperties.setAuthenticateAllArtifacts(true);
    return serviceProperties;
  }

  //
  // CAS authentication provider (authentication manager)
  //
  @Bean
  public CasAuthenticationProvider casAuthenticationProvider() {
    CasAuthenticationProvider casAuthenticationProvider = new CasAuthenticationProvider();
    String host = environment.getProperty("host-alb", "https://" + environment.getRequiredProperty("host-virkailija"));

    casAuthenticationProvider.setUserDetailsService(new OphUserDetailsServiceImpl(host, ConfigEnums.CALLER_ID.value()));

    casAuthenticationProvider.setServiceProperties(serviceProperties());
    casAuthenticationProvider.setTicketValidator(ticketValidator());
    casAuthenticationProvider.setKey(environment.getRequiredProperty("cas.key"));
    return casAuthenticationProvider;
  }

  @Bean
  public TicketValidator ticketValidator() {
    Cas20ProxyTicketValidator ticketValidator = new Cas20ProxyTicketValidator(
      environment.getRequiredProperty("cas.url")
    );
    ticketValidator.setAcceptAnyProxy(true);
    return ticketValidator;
  }

  //
  // CAS filter
  //
  @Bean
  public CasAuthenticationFilter casAuthenticationFilter() throws Exception {
    OpintopolkuCasAuthenticationFilter casAuthenticationFilter = new OpintopolkuCasAuthenticationFilter(
      serviceProperties()
    );
    casAuthenticationFilter.setAuthenticationManager(authenticationManager());
    casAuthenticationFilter.setFilterProcessesUrl("/j_spring_cas_security_check");
    return casAuthenticationFilter;
  }

  //
  // CAS single logout filter
  // requestSingleLogoutFilter is not configured because our users always sign out through CAS
  // logout (using virkailija-raamit
  // logout button) when CAS calls this filter if user has ticket to this service.
  //
  @Bean
  public SingleSignOutFilter singleSignOutFilter() {
    SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
    // singleSignOutFilter.setCasServerUrlPrefix(environment.getProperty("url.cas"));
    singleSignOutFilter.setIgnoreInitConfiguration(true);
    singleSignOutFilter.setSessionMappingStorage(sessionMappingStorage);
    return singleSignOutFilter;
  }

  //
  // CAS entry point
  //
  @Bean
  public CasAuthenticationEntryPoint casAuthenticationEntryPoint() {
    CasAuthenticationEntryPoint casAuthenticationEntryPoint = new CasAuthenticationEntryPoint();
    casAuthenticationEntryPoint.setLoginUrl(environment.getProperty("cas.login"));
    casAuthenticationEntryPoint.setServiceProperties(serviceProperties());
    return casAuthenticationEntryPoint;
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    final String AKT_ROLE = "APP_AKT";
    http
      .csrf()
      .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
      .and()
      .formLogin()
      .and()
      .httpBasic()
      .and()
      .authorizeRequests()
      .antMatchers("/api/v1/clerk/**")
      .hasRole(AKT_ROLE)
      .antMatchers("/virkailija/**")
      .hasRole(AKT_ROLE)
      .mvcMatchers("/virkailija")
      .hasRole(AKT_ROLE)
      .antMatchers("/", "/**")
      .permitAll()
      .anyRequest()
      .authenticated()
      .and()
      .exceptionHandling()
      .accessDeniedHandler(CustomAccessDeniedHandler.create())
      .authenticationEntryPoint(casAuthenticationEntryPoint())
      .and()
      .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class);
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.authenticationProvider(casAuthenticationProvider());
  }

  @Bean
  public UserDetailsService userDetailsService() {
    // TODO Use cas!
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
