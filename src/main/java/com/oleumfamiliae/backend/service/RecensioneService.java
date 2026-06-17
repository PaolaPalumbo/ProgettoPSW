
package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Recensione;
import com.oleumfamiliae.backend.repository.RecensioneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RecensioneService {

    private final RecensioneRepository recensioneRepository;

    public RecensioneService(RecensioneRepository recensioneRepository) {
        this.recensioneRepository = recensioneRepository;
    }

    // Metodo per inviare la recensione (inizialmente non approvata)
    public Recensione inviaRecensione(Recensione recensione) {
        recensione.setApprovata(false); // La moderazione è necessaria
        return recensioneRepository.save(recensione);
    }

    // Metodo per l'amministratore per approvare la recensione
    @Transactional
    public void approvaRecensione(Long id) {
    Recensione recensione = recensioneRepository.findById(id)
        .orElse(null); // Invece di esplodere, restituisci null se non la trovi

    if (recensione != null) {
        recensione.setApprovata(true); // O il campo che usi per l'approvazione
        recensioneRepository.save(recensione);
    } else {
        // Logga l'errore senza far crashare tutto
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