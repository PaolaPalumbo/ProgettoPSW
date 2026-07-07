package com.oleumfamiliae.backend.security;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//dalla richiesta HTTP estrae il token JWT per verificare l'identità dell'utente e impostare il contesto di sicurezza di Spring Security
public class AuthTokenFilter extends OncePerRequestFilter {//il filtro viene applicato una sola volta per ogni richiesta HTTP
    
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);//logger nella console

    @Autowired //dependency injection--->collego automaticamente istanze dei componenti con la classe corrente
    private JwtUtils jwtUtils;

    //Inietto il servizio che recupera i dati e i ruoli dell'utente dal database
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,   //filtri che coinvolgono le richieste HTTP (in entrate e in uscita) e definiscono la catena di filtri di sicurezza
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
                                    throws ServletException, IOException {
        
        // Se la richiesta è per il login, salto il filtro JWT
        // altrimenti il sistema cercherebbe un token che non esiste ancora----> errore 403
        if (request.getRequestURI().contains("/api/utenti/login")) {
            filterChain.doFilter(request, response);//passa comunque il "pacco vuoto e le info user"
            return;
        }

        try {
            String jwt = parseJwt(request);//estrae la stringa del token dell'header authentication
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {//se è tutto ok
                String username = jwtUtils.getUserNameFromJwtToken(jwt);//estrae lo username
                // Per ora il filtro verifica solo il token. 
                // L'impostazione dell'autenticazione avverrà nella UserDetailsService
                
                //Recupero l'utente e lo inserisco nel contesto di sicurezza
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);//preleva le info dell'utente dal DB
                
                UsernamePasswordAuthenticationToken authentication = //contiene le info di autentificazione complete
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, //sono già stata autentificata, non è sicuro tenere la password in memoria
                        userDetails.getAuthorities()); // Qui dentro c'è il ROLE_ADMIN
                        
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                //estrae informazioni "di contorno" dalla richiesta HTTP, come: L'indirizzo IP del client e Il Session ID

                // Ora Spring Security sa ufficialmente chi sono e che poteri ho
                //tutto il framework mi ha autentificato
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Impossibile impostare l'autenticazione utente: {}", e);
        }
        //se il filtro non mi ha bloccato, proseguo
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {//estrae il token dalla richiesta
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {//Authorization: Bearer <mio-token-lungo-e-complesso>
            return headerAuth.substring(7);//ottengo la striga del token
        }
        return null;
    }
}
//token Bearer: "chiunque porti questo token ha diritto di accesso"