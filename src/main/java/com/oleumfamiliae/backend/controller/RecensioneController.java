package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Recensione;
import com.oleumfamiliae.backend.dto.RecensioneResponseDTO; 
import com.oleumfamiliae.backend.service.RecensioneService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors; 
import org.springframework.http.ResponseEntity; 
import org.springframework.security.access.prepost.PreAuthorize; 
import org.springframework.security.core.context.SecurityContextHolder; 

@RestController
@RequestMapping("/api/recensioni")
@CrossOrigin(origins = "http://localhost:4200")
public class RecensioneController {

    private final RecensioneService recensioneService;

    public RecensioneController(RecensioneService recensioneService) {
        this.recensioneService = recensioneService;
    }

    // Estraggo la lista delle MIE recensioni per mostrarle nel mio profilo
    @GetMapping("/miei")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<RecensioneResponseDTO>> getRecensioniMiei() {
        // 1. Estraggo la mia email dal contesto di sicurezza (il token JWT)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Chiedo al mio Service di trovare le mie recensioni
        List<Recensione> recensioni = recensioneService.trovaRecensioniPerUtente(email);
        
        // 3. Converto le entità in DTO per il mio frontend
        List<RecensioneResponseDTO> recensioniDTO = recensioni.stream()
            .map(r -> new RecensioneResponseDTO(
                r.getProdotto().getNome(), 
                r.getVoto(),
                r.getCommento()
            ))
            .collect(Collectors.toList());
            
        // 4. Restituisco la lista formattata pronta per la mia tabella Angular
        return ResponseEntity.ok(recensioniDTO);
    }

    // Invio una nuova recensione al database associandola al mio account
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Recensione> invia(@RequestBody Recensione recensione) {
        // 1. Estraggo la mia email dal contesto di sicurezza
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Chiedo al mio Service di inviare la recensione associandola alla mia email
        Recensione salvata = recensioneService.inviaRecensione(recensione, email);
        
        // 3. Restituisco la recensione salvata
        return ResponseEntity.ok(salvata);
    }

    // Approvo la recensione indicata dal mio ID
    @PostMapping("/approva/{id}")
    public void approva(@PathVariable Long id) {
        recensioneService.approvaRecensione(id);
    }
    
    // Recupero tutte le recensioni già approvate per un determinato prodotto
    @GetMapping("/prodotto/{id}")
    public List<Recensione> getRecensioniPerProdotto(@PathVariable Long id) {
        return recensioneService.getRecensioniByProdotto(id);
    }
    
    // Recupero le recensioni in attesa di moderazione
    @GetMapping("/da-approvare")
    public List<Recensione> getDaApprovare() {
        return recensioneService.getRecensioniDaApprovare();
    }
}