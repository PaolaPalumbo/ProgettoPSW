package com.oleumfamiliae.backend.controller;

import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.service.ProdottoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
@CrossOrigin(origins = "http://localhost:4200") 

public class ProdottoController {

    private final ProdottoService prodottoService;

    public ProdottoController(ProdottoService prodottoService) {
        this.prodottoService = prodottoService;
    }

    // Quando Angular fa una richiesta GET, restituisco il catalogo
    @GetMapping
    public List<Prodotto> getCatalogo() {
        return prodottoService.ottieniCatalogo();
    }

    // Quando Angular fa una richiesta POST (dalla dashboard), aggiungo l'olio
    @PostMapping
    public Prodotto aggiungiProdotto(@RequestBody Prodotto prodotto) {
        return prodottoService.aggiungiProdotto(prodotto);
    }
}