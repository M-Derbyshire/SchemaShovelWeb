package uk.mddeveloper.SchemaShovelWebAPI;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		//For now, allowing all cross-site requests.
		//If implementing this site for real, would only allow the actual domain.
		http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());
		http.csrf().ignoringAntMatchers("/**");
	}
	
}
