package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Recensione;
import com.oleumfamiliae.backend.model.Utente; // Importo l'entità Utente
import com.oleumfamiliae.backend.repository.RecensioneRepository;
import com.oleumfamiliae.backend.repository.UtenteRepository; // Importo il repository per trovare l'utente
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RecensioneService {

    private final RecensioneRepository recensioneRepository;
    private final UtenteRepository utenteRepository; // Aggiungo l'iniezione per trovare l'utente

    public RecensioneService(RecensioneRepository recensioneRepository, UtenteRepository utenteRepository) {
        this.recensioneRepository = recensioneRepository;
        this.utenteRepository = utenteRepository;
    }

    // Aggiungo questo metodo per recuperare le mie recensioni tramite l'email
    public List<Recensione> trovaRecensioniPerUtente(String email) {
        return recensioneRepository.findByUtenteEmail(email);
    }

    // Invio la recensione collegandola al mio utente e impostandola come non approvata
    public Recensione inviaRecensione(Recensione recensione, String email) {
        // Cerco il mio utente tramite l'email e lo associo alla recensione
        Utente utente = utenteRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Errore: utente non trovato per l'email " + email));
        
        recensione.setUtente(utente); // Associo l'utente alla recensione
        recensione.setApprovata(false); // La moderazione è necessaria
        return recensioneRepository.save(recensione);
    }

    // Metodo per l'amministratore per approvare la recensione
    @Transactional
    public void approvaRecensione(Long id) {
        Recensione recensione = recensioneRepository.findById(id)
            .orElse(null); // Invece di esplodere, restituisco null se non la trovo

        if (recensione != null) {
            recensione.setApprovata(true); // O il campo che uso per l'approvazione
            recensioneRepository.save(recensione);
        } else {
            // Loggo l'errore senza far crashare tutto
            System.out.println("Attenzione: tentativo di approvare una recensione inesistente (ID: " + id + ")");
        }
    }

    public List<Recensione> getRecensioniByProdotto(Long prodottoId) {
        return recensioneRepository.findByProdotto_IdAndApprovataTrue(prodottoId);
    }

    public List<Recensione> getRecensioniDaApprovare() {
        return recensioneRepository.findByApprovataFalse();
    }
    
}