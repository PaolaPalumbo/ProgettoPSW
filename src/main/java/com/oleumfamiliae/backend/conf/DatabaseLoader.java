package com.oleumfamiliae.backend.conf;

import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository; // Aggiungiamo la repository dell'utente

    // Aggiorniamo il costruttore per iniettare entrambe le repository
    public DatabaseLoader(ProdottoRepository prodottoRepository, UtenteRepository utenteRepository) {
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // 1. Crea un utente di test se il database è vuoto
        if (utenteRepository.count() == 0) {
            Utente u = new Utente();
            // Inserisci i campi in base a come li hai definiti nel tuo model Utente
            u.setNome("Mario"); 
            u.setCognome("Rossi");
            u.setEmail("mario.rossi@test.com");
            u.setPassword("passwordSicura");
            utenteRepository.save(u);
            System.out.println("--- Utente di test inserito nel database! ---");
        }

        // 2. Crea un prodotto di test se il database è vuoto
        if (prodottoRepository.count() == 0) {
            Prodotto p = new Prodotto();
            p.setNome("Olio Extravergine 1L");
            p.setPrezzo(15.00);
            p.setDescrizione("Olio di oliva di qualità superiore.");
            // Aggiungi altri campi se necessari
            prodottoRepository.save(p);
            System.out.println("--- Prodotto di test inserito nel database! ---");
        }
    }
}