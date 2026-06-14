package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.OrdineRepository;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // Ricorda di importare LocalDateTime

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository;

    public OrdineService(OrdineRepository ordineRepository, ProdottoRepository prodottoRepository, UtenteRepository utenteRepository) {
        this.ordineRepository = ordineRepository;
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
    }

    @Transactional 
    public Ordine effettuaCheckout(CheckoutDTO checkoutDTO) {
        
        // 1. Identifico l'utente che sta acquistando
        Utente utente = utenteRepository.findById(checkoutDTO.getIdUtente())
                .orElseThrow(() -> new RuntimeException("Utente non trovato!"));

        // 2. Identifico il prodotto per controllare il magazzino e il prezzo
        Prodotto prodotto = prodottoRepository.findById(checkoutDTO.getIdProdotto())
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato!"));

        // 3. Controllo se c'è abbastanza olio in magazzino
        if (prodotto.getQuantitaDisponibile() < checkoutDTO.getQuantita()) {
            throw new RuntimeException("Quantità non sufficiente in magazzino!");
        }

        // 4. Scalo la quantità venduta e aggiorno l'inventario
        prodotto.setQuantitaDisponibile(prodotto.getQuantitaDisponibile() - checkoutDTO.getQuantita());
        prodottoRepository.save(prodotto); 

        // 5. Assemblo l'ordine finale con i campi esatti del tuo Model
        Ordine nuovoOrdine = new Ordine();
        nuovoOrdine.setUtente(utente);
        nuovoOrdine.setDataOrdine(LocalDateTime.now()); // Imposta la data e l'ora attuali
        
        // Calcolo il totale: prezzo singolo * quantità richiesta
        Double totaleCalcolato = prodotto.getPrezzo() * checkoutDTO.getQuantita();
        nuovoOrdine.setTotale(totaleCalcolato);
        
        nuovoOrdine.setStato("ricevuto"); 
        
        return ordineRepository.save(nuovoOrdine);
    }
}