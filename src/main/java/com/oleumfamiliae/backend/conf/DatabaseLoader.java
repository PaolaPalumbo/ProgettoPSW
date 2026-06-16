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

        // 2. Crea un catalogo di prodotti di test se il database è vuoto
        if (prodottoRepository.count() == 0) {
            
            // Prodotto 1: Quello originale
            Prodotto p1 = new Prodotto();
            p1.setNome("Olio Extravergine 1L");
            p1.setPrezzo(15.00);
            p1.setDescrizione("Olio di oliva di qualità superiore, estratto a freddo.");
            p1.setFormato("Bottiglia 1L"); 
            p1.setQuantitaDisponibile(100);
            p1.setImmagineUrl("assets/images/bottiglia.jpg");
            prodottoRepository.save(p1);

            // Prodotto 2: La latta grande
            Prodotto p2 = new Prodotto();
            p2.setNome("Olio Extravergine - Latta Famiglia");
            p2.setPrezzo(55.00);
            p2.setDescrizione("Ideale per la scorta di famiglia. Conserva intatta tutta la freschezza e le proprietà nutrizionali.");
            p2.setFormato("Latta 5L"); 
            p2.setQuantitaDisponibile(50);
            p2.setImmagineUrl("assets/images/latta5L.jpg");
            prodottoRepository.save(p2);

            // Prodotto 3: La bottiglia elegante
            Prodotto p3 = new Prodotto();
            p3.setNome("Olio Extravergine - Premium");
            p3.setPrezzo(12.50);
            p3.setDescrizione("Elegante bottiglia in vetro scuro. Perfetta da portare in tavola o come idea regalo.");
            p3.setFormato("Bottiglia 750ml"); 
            p3.setQuantitaDisponibile(80);
            p3.setImmagineUrl("assets/images/bottiglia.jpg");
            prodottoRepository.save(p3);

            // Prodotto 4: La latta media
            Prodotto p4 = new Prodotto();
            p4.setNome("Olio Extravergine - Pratico");
            p4.setPrezzo(30.00);
            p4.setDescrizione("Il giusto compromesso per l'uso quotidiano, pratico e maneggevole.");
            p4.setFormato("Latta 3L"); 
            p4.setQuantitaDisponibile(60);
            p4.setImmagineUrl("assets/images/lattaPiccola.jpg");
            prodottoRepository.save(p4);

            System.out.println("--- Catalogo prodotti di test inserito nel database! ---");
        }
    }
}