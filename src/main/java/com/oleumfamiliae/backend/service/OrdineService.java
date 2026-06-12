package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.repository.OrdineRepository;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final ProdottoRepository prodottoRepository;

    // Costruttore: Spring inietta automaticamente i Repository qui dentro
    public OrdineService(OrdineRepository ordineRepository, ProdottoRepository prodottoRepository) {
        this.ordineRepository = ordineRepository;
        this.prodottoRepository = prodottoRepository;
    }

    @Transactional 
    public Ordine effettuaCheckout(Ordine ordine, Long prodottoId, int quantitaAcquistata) {
        
        // 1. Cercol'olio richiesto nel database
        Prodotto prodotto = prodottoRepository.findById(prodottoId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato!"));

        // 2. Controllo se c'è abbastanza olio in magazzino
        if (prodotto.getQuantitaDisponibile() < quantitaAcquistata) {
            throw new RuntimeException("Quantità non sufficiente in magazzino!");
        }

        // 3. Scalo la quantità venduta dal magazzino
        prodotto.setQuantitaDisponibile(prodotto.getQuantitaDisponibile() - quantitaAcquistata);
        prodottoRepository.save(prodotto); // Aggiorniamo l'inventario

        // 4. Salvo l'ordine definitivo
        ordine.setStato("ricevuto"); 
        return ordineRepository.save(ordine);
    }
}