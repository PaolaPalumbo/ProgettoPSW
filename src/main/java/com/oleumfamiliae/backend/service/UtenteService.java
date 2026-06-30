package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.IndirizzoSpedizione;
import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.IndirizzoSpedizioneRepository;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- AGGIUNTO: Import per garantire l'integrità durante la cancellazione
import java.util.Optional; 

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder; 
    private final IndirizzoSpedizioneRepository indirizzoSpedizioneRepository;

    public UtenteService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder, IndirizzoSpedizioneRepository indirizzoSpedizioneRepository) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.indirizzoSpedizioneRepository = indirizzoSpedizioneRepository;
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
    //E' importante notare che ogni utente di default è uno USER,
    //  e solo l'amministratore può promuovere un utente a ADMIN.



    

    // 2. Login (Versione con log di controllo)
    public Utente effettuaLogin(String email, String password) {
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato!"));
        
        if (!passwordEncoder.matches(password, utente.getPassword())) {
            throw new RuntimeException("Password errata!");
        }
        
        // DEBUG: riga per vedere in console cosa viene passato al Controller
        System.out.println("DEBUG LOGIN: Utente trovato: " + utente.getEmail() + 
                           " | Ruolo nel DB: " + utente.getRuolo() + 
                           " | ID: " + utente.getId());
                           
        return utente;
    }

    // 3. Eliminazione account utente
    @Transactional
    public void eliminaUtentePerEmail(String email) {
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        
        // Se l'utente ha relazioni (es. recensioni o ordini), assicurati che nel model 
        // sia impostato il CascadeType.REMOVE o gestisci la disassociazione qui
        utenteRepository.delete(utente);
    }

   // 4. Aggiungo un nuovo indirizzo di spedizione alla rubrica dell'utente
    @Transactional
    public IndirizzoSpedizione aggiungiIndirizzoUtente(Long utenteId, IndirizzoSpedizione nuovoIndirizzo) {
        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + utenteId));
        
        // Collego l'indirizzo all'utente trovato
        nuovoIndirizzo.setUtente(utente);
        return indirizzoSpedizioneRepository.save(nuovoIndirizzo);
    }

    // 5. Recupera tutti gli indirizzi salvati da un singolo utente
    public java.util.List<IndirizzoSpedizione> getIndirizziPerUtente(Long utenteId) {
        if (!utenteRepository.existsById(utenteId)) {
            throw new RuntimeException("Utente non trovato con id: " + utenteId);
        }
        return indirizzoSpedizioneRepository.findByUtenteId(utenteId);
    }

    public void eliminaIndirizzo(Long id) {
        if (indirizzoSpedizioneRepository.existsById(id)) {
            indirizzoSpedizioneRepository.deleteById(id);
        } else {
            throw new RuntimeException("Indirizzo non trovato con ID: " + id);
        }
    }

}
