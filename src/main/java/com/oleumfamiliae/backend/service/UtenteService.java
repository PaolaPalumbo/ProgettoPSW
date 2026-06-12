package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.stereotype.Service;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;

    public UtenteService(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }

    // 1. Registrazione nuovo cliente
    public Utente registraUtente(Utente utente) {
        // Uso il metodo personalizzato creato nel Repository!
        if (utenteRepository.findByEmail(utente.getEmail()).isPresent()) {
            throw new RuntimeException("Esiste già un account con questa email!");
        }
        
        // da implementare 
        // la sicurezza per "criptare" questa password prima di salvarla!
        return utenteRepository.save(utente);
    }

    // 2. Login
    public Utente effettuaLogin(String email, String password) {
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato!"));
        
        if (!utente.getPassword().equals(password)) {
            throw new RuntimeException("Password errata!");
        }
        
        return utente;
    }
}


/*Cosa fa: Questo servizio gestisce l'accesso. Controlla che non ci siano
 due clienti con la stessa email durante la registrazione e verifica
 che la password sia corretta durante il login. */