package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.service.UtenteService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin; // Importante!
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @PostMapping("/registrazione")
    public Utente registra(@RequestBody Utente utente) {
        return utenteService.registraUtente(utente);
    }

    @PostMapping("/login")
    public Utente login(@RequestParam String email, @RequestParam String password) {
        // Nota: questo è un login base. In seguito lo integro con i token JWT
        return utenteService.effettuaLogin(email, password);
    }
}