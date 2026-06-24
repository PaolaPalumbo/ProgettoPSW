package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.service.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController //scambio di dati in JSON tramite DTO
@RequestMapping("/api/admin/ordini")//rotta
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')") // Solo l'admin passa da qui!
public class AdminController {

    private final OrdineService ordineService;

    public AdminController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    // Io recupero tutti gli ordini per la dashboard
    @GetMapping
    public ResponseEntity<List<Ordine>> getTuttiGliOrdini() {
        return ResponseEntity.ok(ordineService.getTuttiGliOrdini()); // <-- Aggiornato qui
    }

    // Io aggiorno lo stato dell'ordine
    @PostMapping("/aggiorna-stato/{id}")
    public ResponseEntity<Void> aggiornaStato(@PathVariable Long id, @RequestBody String nuovoStato) {
        ordineService.aggiornaStatoOrdine(id, nuovoStato); // <-- Aggiornato qui
        return ResponseEntity.ok().build();
    }
}