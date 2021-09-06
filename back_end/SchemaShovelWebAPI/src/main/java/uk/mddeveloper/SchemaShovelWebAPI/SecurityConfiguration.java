package uk.mddeveloper.SchemaShovelWebAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Provides the security configuration for the application
 * @author Matthew Derbyshire
 *
 */
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	/**
	 * The environment properties
	 */
	@Autowired
	private Environment env;
	
	/**
	 * The name of the allowed origin property in the environment properties
	 */
	private String allowedOriginPropertyName = "app.frontend-origin";
	
	/**
	 * Configure the security of the application
	 */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	http.cors().and().csrf().disable();
    }
    
    /**
     * Provides CORS security configuration
     * @author Matthew Derbyshire
     *
     */
    @Configuration
    public class CorsConfig {
    	
    	/**
    	 * Provides CORS Filter configuration
    	 * @return CORS Filter configuration
    	 */
        @Bean
        public CorsFilter corsFilter() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin(env.getProperty(allowedOriginPropertyName));
            config.addAllowedHeader("*");
            config.addAllowedMethod("POST");
            config.addAllowedMethod("GET");
            config.addAllowedMethod("PATCH");
            config.addAllowedMethod("DELETE");
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
        }
    }
}
