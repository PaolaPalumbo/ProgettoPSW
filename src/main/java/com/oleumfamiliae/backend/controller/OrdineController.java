package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.service.OrdineService;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ordini")
@CrossOrigin(origins = "http://localhost:4200")
public class OrdineController {

    private final OrdineService ordineService;
    private final UtenteRepository utenteRepository; 

    public OrdineController(OrdineService ordineService, UtenteRepository utenteRepository) {
        this.ordineService = ordineService;
        this.utenteRepository = utenteRepository;
    }

    // Questo metodo usa il DTO per ricevere solo i dati strettamente necessari dal frontend
    @PostMapping("/checkout")
    public Ordine effettuaCheckout(@RequestBody CheckoutDTO checkoutData) {
        
        // 1. Recupero il profilo del cliente dal database
        Utente cliente = utenteRepository.findById(checkoutData.getIdUtente())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        // 2. Preparo lo "scheletro" del nuovo Ordine
        Ordine nuovoOrdine = new Ordine();
        nuovoOrdine.setUtente(cliente);
        nuovoOrdine.setDataOrdine(LocalDateTime.now());
        nuovoOrdine.setTotale(0.0); // Il calcolo esatto lo delegheremo al Service
        
        // 3. Avvio la Transazione: salva l'ordine e scala l'olio dal magazzino
        return ordineService.effettuaCheckout(nuovoOrdine, checkoutData.getIdProdotto(), checkoutData.getQuantita());
    }
}
