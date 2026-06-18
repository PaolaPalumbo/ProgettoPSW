package com.oleumfamiliae.backend.controller;

import java.util.List;
import java.util.stream.Collectors; // Aggiunto per poter convertire la lista
import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.dto.OrdineResponseDTO; // Importo la "busta" per la cronologia
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.service.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordini")
@CrossOrigin(origins = "http://localhost:4200")
public class OrdineController {

    private final OrdineService ordineService;

    // Ho rimosso l'UtenteRepository: il mio Controller non deve più interrogare direttamente il DB!
    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> effettuaCheckout(@RequestBody CheckoutDTO checkoutData) {
        try {
            // Passo semplicemente la "busta" (DTO) al mio Service.
            // Sarà il Service a recuperare le entità e applicare la logica in totale isolamento.
            Ordine ordineSalvato = ordineService.effettuaCheckout(checkoutData);
            
            return ResponseEntity.ok(ordineSalvato);
        } catch (Exception e) {
            // Se il mio Service lancia un'eccezione (es. "Quantità non sufficiente"), 
            // rispondo al frontend con un errore 400.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Espongo l'endpoint per la mia cronologia ordini protetto da autorizzazione.
    // Utilizzo il SecurityContextHolder per estrarre la mia identità dal token JWT,
    // garantendo un approccio stateless e sicuro che evita l'esposizione di parametri manipolabili.
    @GetMapping("/miei")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrdineResponseDTO>> getOrdiniMiei() {
        // 1. Estraggo la mia email dal contesto di sicurezza (il token JWT)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Chiedo al Service di trovare i miei ordini
        List<Ordine> ordini = ordineService.trovaOrdiniPerUtente(email);
        
        // 3. Converto le entità pesanti del DB in DTO leggeri e sicuri per il mio frontend
        List<OrdineResponseDTO> ordiniDTO = ordini.stream()
            .map(ordine -> new OrdineResponseDTO(
                ordine.getId(),
                ordine.getDataOrdine(),
                ordine.getTotale()
            ))
            .collect(Collectors.toList());
            
        // 4. Restituisco la lista pronta per la mia tabella Angular
        return ResponseEntity.ok(ordiniDTO);
    }
}