package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Recensione;
import com.oleumfamiliae.backend.service.RecensioneService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recensioni")
@CrossOrigin(origins = "http://localhost:4200")
public class RecensioneController {

    private final RecensioneService recensioneService;

    public RecensioneController(RecensioneService recensioneService) {
        this.recensioneService = recensioneService;
    }

    @PostMapping
    public Recensione invia(@RequestBody Recensione recensione) {
        return recensioneService.inviaRecensione(recensione);
    }

    @PostMapping("/approva/{id}")
    public void approva(@PathVariable Long id) {
        recensioneService.approvaRecensione(id);
    }
    
    @GetMapping("/prodotto/{id}")
    public List<Recensione> getRecensioniPerProdotto(@PathVariable Long id) {
        return recensioneService.getRecensioniByProdotto(id);
    }
    
    @GetMapping("/da-approvare")
    public List<Recensione> getDaApprovare() {
        return recensioneService.getRecensioniDaApprovare();
    }
}

