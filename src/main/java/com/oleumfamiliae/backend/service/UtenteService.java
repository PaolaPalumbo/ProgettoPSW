package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;
import java.util.Optional; 

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder; 

    public UtenteService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Registrazione nuovo cliente
    public Utente registraUtente(Utente utente) {
        if (utenteRepository.findByEmail(utente.getEmail()).isPresent()) {
            throw new RuntimeException("Esiste già un account con questa email!");
        }
        
        // Protezione: cripto la password prima di salvarla nel database
        String passwordCriptata = passwordEncoder.encode(utente.getPassword());
        utente.setPassword(passwordCriptata);
        
        // Assicuro che l'utente abbia un ruolo di default se non specificato
        if (utente.getRuolo() == null) {
            utente.setRuolo("USER");
        }
        
        return utenteRepository.save(utente);
    }

    // 2. Login
    public Utente effettuaLogin(String email, String password) {
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato!"));
        
        // Verifica: confronto la password in chiaro con quella criptata nel database
        if (!passwordEncoder.matches(password, utente.getPassword())) {
            throw new RuntimeException("Password errata!");
        }
        
        // Il backend restituisce l'utente completo (inclusi i ruoli) 
        // così il token generato nel Controller potrà includerli
        return utente;
    }
}