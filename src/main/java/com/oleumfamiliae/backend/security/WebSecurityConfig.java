package com.oleumfamiliae.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.DispatcherType;
import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // LA NOSTRA CIMICE: Se Spring legge questo file, stamperà questa frase nel terminale!
        System.out.println("===============================================");
        System.out.println("STO CARICANDO LA NOSTRA SICUREZZA PERSONALIZZATA!");
        System.out.println("===============================================");
        
        http
            // 1. Applichiamo il CORS globale per far comunicare Angular
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            
            // 2. Disattiviamo le vecchie pagine HTML di login di Spring Boot
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            
            .authorizeHttpRequests(auth -> auth
                // 3. Sblocchiamo la visibilità degli errori interni (il finto 401)
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll() 
                
                // 4. Proteggiamo il pannello di controllo
                // .requestMatchers("/api/recensioni/approva/**").hasRole("ADMIN")
                
                // 5. Apriamo le porte esatte al catalogo
                .requestMatchers(
                    "/api/auth/**", 
                    "/api/prodotti", "/api/prodotti/**", 
                    "/api/recensioni", "/api/recensioni/**",
                    "/api/recensioni/approva/**", // <-- AGGIUNTA QUI TEMPORANEAMENTE
                    "/error"
                ).permitAll()
                
                .anyRequest().authenticated() 
            );

        // Aggiungo il MIO filtro (ora che non è più un @Component globale)
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}