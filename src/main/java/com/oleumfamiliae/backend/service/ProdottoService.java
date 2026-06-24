package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;

    // Costruttore per l'iniezione delle dipendenze
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

    // Metodo per l'amministratore: aggiorna la giacenza a magazzino
    public Prodotto aggiornaQuantita(Long id, int nuovaQuantita) {
        // Cerchiamo il prodotto. Se non esiste, lanciamo un'eccezione
        Prodotto prodotto = prodottoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Errore: Prodotto con ID " + id + " non trovato."));
            
        // Aggiorniamo la quantità
        prodotto.setQuantitaDisponibile(nuovaQuantita);
        
        // Salviamo le modifiche nel database
        return prodottoRepository.save(prodotto);
    }

    // 3. Metodo per ricerca e filtraggio dei prodotti
    public List<Prodotto> cercaProdotti(String nome, String formato, Double prezzoMin) {
        return prodottoRepository.findAll().stream()
            //filtro per nome, se il nome è null o vuoto, non filtriamo
            .filter(p -> (nome == null || nome.isEmpty() || p.getNome().toLowerCase().contains(nome.toLowerCase())))
            
            //filtro per formato, se il formato è null o vuoto, non filtriamo
            .filter(p -> (formato == null || formato.isEmpty() || p.getFormato().equalsIgnoreCase(formato)))
            
            //filtro per prezzo minimo, se il prezzoMin è null, non filtriamo
            .filter(p -> (prezzoMin == null || p.getPrezzo() >= prezzoMin))
            
            //colleziono i risultati filtrati in una lista
            .collect(Collectors.toList());
    }
}

/*Usa i metodi automatici del Repository (findAll e save) 
per recuperare la lista di tutto l'olio disponibile da mostrare 
nel frontend in Angular e per permettere di inserire nuovi formati. */