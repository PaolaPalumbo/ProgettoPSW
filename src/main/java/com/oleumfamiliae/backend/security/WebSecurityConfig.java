package com.oleumfamiliae.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; 
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // <-- AGGIUNTO: Necessario per @PreAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; 
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse; 
import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity//la classe regola il comportamento web definito nella classe stessa
@EnableMethodSecurity //Attiva i controlli @PreAuthorize presenti nei miei Controller!
public class WebSecurityConfig {//definisco le regole globali, i permessi e il comportamento del server di fronte alle richieste in arrivo.

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {//catena di montaggio 

        //per vedere se funziona dal terminale
        System.out.println("===============================================");
        System.out.println("STO CARICANDO LA SICUREZZA PERSONALIZZATA!");
        System.out.println("===============================================");
        
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))//permette la comunazione sicura, mediante HTTP, con Angular
            .csrf(csrf -> csrf.disable())//disabilito perchè gestiti da Angular mediante le sue API
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            //ogni richiesta viene autenticata dal suo token, nulla deve essere salvato in memoria
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .exceptionHandling(exc -> exc
                .authenticationEntryPoint((request, response, authException) -> 
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Credenziali non valide o inesistenti")
                )
            )
            
            //costruisco la mappa di ciò che è pubblico e ciò che è privato
            .authorizeHttpRequests(auth -> auth
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll() 
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // 1. REGOLA SPECIFICA CORRETTA: Ho rimosso i doppi jolly ambigui
                .requestMatchers(HttpMethod.PUT, "/api/prodotti/*/quantita").authenticated()
                
                // 2. REGOLA GENERALE: Permetto letture pubbliche dei prodotti
                .requestMatchers(HttpMethod.GET, "/api/prodotti", "/api/prodotti/*").permitAll()

                // --- AGGIUNTO: Proteggo esplicitamente le mie nuove rotte per gli ordini ---
                // Il filtro si assicura che ci sia un token. Poi il @PreAuthorize nel Controller controllerà che sia un ADMIN.
                .requestMatchers(HttpMethod.GET, "/api/ordini/tutti").authenticated()//richiede il token presente e valido
                .requestMatchers(HttpMethod.PUT, "/api/ordini/*/stato").authenticated()
                
                .requestMatchers(//rotte pubbliche che non richiedono autorizzazioni
                    "/api/utenti/**",
                    "/api/auth/**", 
                    "/api/recensioni", "/api/recensioni/**",
                    "/api/recensioni/approva/**",
                    "/api/utenti/login",
                    "/api/utenti/registrazione",
                    "/error"
                ).permitAll()
                
                .anyRequest().authenticated() //qualsiasi rotta che non ho elencato, viene bloccata da Spring Security
            );
        //eseguo il controllo basato su JWT prima di procedere con l'autenticazione utente (disabilitata prima di compilare i campi perchè 
        //l'utente ancora non ha il token)
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();//creo l'oggetto che contiene le regole CORS
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));//definisce chi puo' accedere al server
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));//metodi HTTP concessi
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));//attestazioni HTTP che il fronted invia
        configuration.setAllowCredentials(true);//permette l'invio di credenziali nella richiesta: cookie, intestazioni di autorizzazione
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);//applica la configurazione a tutti i percorsi
        return source;
    }

    @Bean
    //componente che dopo il login verifica che le credenziali corrispondano a quelle del DB
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    //controllo il token
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    //utilizzo BCryptPasswordEncoder per salvare in maniera sicura la password nel DB
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}