package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;

    public ProdottoService(ProdottoRepository prodottoRepository) {
        this.prodottoRepository = prodottoRepository;
    }

    // 1. Metodo per visualizzare il catalogo (richiesto dalle specifiche)
    public List<Prodotto> ottieniCatalogo() {
        return prodottoRepository.findAll();
    }

    // 2. Metodo per la dashboard di amministrazione (per inserire nuove varianti di olio)
    public Prodotto aggiungiProdotto(Prodotto prodotto) {
        return prodottoRepository.save(prodotto);
    }
}

/*Cosa fa: Usa i metodi automatici del Repository (findAll e save) 
per recuperare la lista di tutto l'olio disponibile da mostrare 
nel frontend in Angular e per permetterti di inserire nuovi formati. */