package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.service.UtenteService;
import com.oleumfamiliae.backend.security.JwtUtils;
import com.oleumfamiliae.backend.dto.LoginRequest; // Importato il DTO per leggere il body JSON
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200")
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

    // 2. Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Nota: questo è un login evoluto con token JWT.
        // Utilizzo l'AuthenticationManager per validare le credenziali.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        // Genero il token JWT tramite la classe JwtUtils
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // Restituisco il token che il frontend userà per le chiamate successive
        return ResponseEntity.ok(jwt);
    }
}