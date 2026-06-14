package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.service.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordini")
@CrossOrigin(origins = "http://localhost:4200")
public class OrdineController {

    private final OrdineService ordineService;

    // Rimosso l'UtenteRepository: il Controller non deve più interrogare direttamente il DB!
    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> effettuaCheckout(@RequestBody CheckoutDTO checkoutData) {
        try {
            // Il Controller passa semplicemente la "busta" (DTO) al Service.
            // Sarà il Service a recuperare le entità e applicare la logica in totale isolamento.
            Ordine ordineSalvato = ordineService.effettuaCheckout(checkoutData);
            
            return ResponseEntity.ok(ordineSalvato);
        } catch (Exception e) {
            // Se il Service lancia un'eccezione (es. "Quantità non sufficiente"), 
            // il Controller risponde al frontend con un errore 400.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}