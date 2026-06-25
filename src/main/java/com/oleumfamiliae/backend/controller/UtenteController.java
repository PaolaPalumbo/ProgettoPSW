package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.service.UtenteService;
import com.oleumfamiliae.backend.security.JwtUtils;
import com.oleumfamiliae.backend.dto.JwtResponse;
import com.oleumfamiliae.backend.dto.LoginRequest; // Importato il DTO per leggere il body JSON
import org.springframework.http.HttpStatus; // Aggiunto per la gestione degli status di errore
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.security.Principal; // Aggiunto per identificare l'utente autenticato tramite il token JWT

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

    private final UtenteService utenteService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UtenteController(UtenteService utenteService, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.utenteService = utenteService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    // 1. Registrazione nuovo cliente
    @PostMapping("/registrazione")
    public ResponseEntity<Utente> registra(@RequestBody Utente utente) {
        // Il controller riceve il payload JSON, lo inoltra al Service per i controlli 
        // di business e restituisce l'utente persistito con Status 200 OK.
        return ResponseEntity.ok(utenteService.registraUtente(utente));
    }

    // 2. Login aggiornato
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Autenticazione standard
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        // 2. Generazione del token
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // 3. Recupero l'utente per ottenere il ruolo
        // Nota: questo metodo usa il servizio che abbiamo appena sistemato
        Utente utente = utenteService.effettuaLogin(loginRequest.getEmail(), loginRequest.getPassword());
        
        // 4. Risposta completa (Token + Ruolo)
        return ResponseEntity.ok(new JwtResponse(jwt, utente.getRuolo()));
    }

    // 3. Eliminazione account utente loggato
    @DeleteMapping("/elimina-account")
    public ResponseEntity<?> eliminaAccount(Principal principal) {
        // Il Principal viene inserito automaticamente da Spring Security recuperando
        // l'identità (email) impostata nel SecurityContext dal filtro del token JWT.
        String email = principal.getName();
        
        try {
            utenteService.eliminaUtentePerEmail(email);
            return ResponseEntity.ok().body("{\"message\": \"Account eliminato con successo\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Impossibile eliminare l'account al momento\"}");
        }
    }
}