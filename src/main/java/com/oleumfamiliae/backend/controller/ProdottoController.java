package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.service.ProdottoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
public class ProdottoController {

    private final ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    // Test Tracciante: bypassa il database per verificare la sicurezza
    @GetMapping("/ping")
    public String ping() {
        return "Backend Sbloccato!";
    }
    
    // accetto l'URI sia con lo slash che senza!
    @GetMapping({"", "/"})
    public List<Prodotto> getCatalogo() {
        return prodottoService.ottieniCatalogo();
    }

    // Applico la stessa protezione anche alla POST
    @PostMapping({"", "/"})
    public Prodotto aggiungiProdotto(@RequestBody Prodotto prodotto) {
        return prodottoService.aggiungiProdotto(prodotto);
    }
}