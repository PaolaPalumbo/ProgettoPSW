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

@Configuration//la classe è un "manuale di istruzioni" per la Spring Security
@EnableWebSecurity//la classe regola il comportamento web definito nella classe stessa
@EnableMethodSecurity //Attiva i controlli @PreAuthorize presenti nei miei Controller
public class WebSecurityConfig {//definisco le regole globali, i permessi e il comportamento del server di fronte alle richieste in arrivo.

    @Bean//il metodo viene chiamato all'avvio dell'app, il risultato viene salvato in memoria e puo' essere usato dalle altre classi
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {//catena di montaggio 

        //per vedere se funziona dal terminale
        System.out.println("===============================================");
        System.out.println("STO CARICANDO LA SICUREZZA PERSONALIZZATA");
        System.out.println("===============================================");
        
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))//permette la comunazione sicura, mediante HTTP, con Angular
            //senza CORS il BROWSER blocca le richieste provenienti da un dominio diverso da quello del server (ad esempio, localhost:4200 per Angular e localhost:8080 per Spring Boot)
            
            .csrf(csrf -> csrf.disable())//disabilito perchè gestiti da Angular mediante le sue API
            //è un attacco comune delle vecchie app web che sfruttavano i cookie di sessione per autenticare l'utente. 
            //visto che uso JWT è inutile usarla, quindi la disabilito per evitare conflitti con Angular.


            //disattivo i meccanismi di login standard di Spring Security,
            //  che non sono compatibili con il mio flusso di autenticazione basato su JWT:
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
           
           
            //ogni richiesta viene autenticata dal suo token, nulla deve essere salvato in memoria STATELESS
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            

            //defnisco il comportamento del server di fronte a RICHIESTE HTTP NON AUTORIZZATE (senza token o con token alterato)
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
        //eseguo il controllo basato su JWT prima di procedere con l'autenticazione utente standard (disabilitata prima di compilare i campi perchè 
        //l'utente ancora non ha il token)
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    //applico le regole CORS a tutte le rotte per permettere al mio frontend Angular di dialogare
    // con il backend Spring Boot senza essere bloccato dal browser
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

/*@Bean VS @Service:
@Bean viene utilizzato per i metodi, come @Service preleva un risultato e lo salva in memoria per essere utilizzato dalle altre classi, la differenza 
risiede nel fatto che @Service è utilizzato per le classi, in realtà, si usa @Bean per metodi scritti da altri, o in codici più complessi
per forzare il caricamento dei dati in memoria*/ 