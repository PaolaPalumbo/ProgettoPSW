package com.oleumfamiliae.backend.service;

import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.dto.ItemDTO; // Import necessario per la lista prodotti
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.model.Prodotto;
import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.OrdineRepository;
import com.oleumfamiliae.backend.repository.ProdottoRepository;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import java.time.LocalDateTime;

@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final ProdottoRepository prodottoRepository;
    private final UtenteRepository utenteRepository;

    public OrdineService(OrdineRepository ordineRepository, ProdottoRepository prodottoRepository, UtenteRepository utenteRepository) {
        this.ordineRepository = ordineRepository;
        this.prodottoRepository = prodottoRepository;
        this.utenteRepository = utenteRepository;
    }

    // --- MODIFICATO: Ora riceve l'intero CheckoutDTO e l'email sicura dal token ---
    @Transactional 
    public Ordine effettuaCheckout(CheckoutDTO checkoutData, String email) {
        
        // 1. Identifico l'utente che sta acquistando in modo sicuro tramite l'email del token
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato!"));

        Double totaleCalcolato =0.0;

        // 2. Itero su tutti gli articoli presenti nella "busta" (il carrello)
        for (ItemDTO item : checkoutData.getProdotti()) {
            
            // Identifico il singolo prodotto per controllare il magazzino e il prezzo
            Prodotto prodotto = prodottoRepository.findById(item.getIdProdotto())
                    .orElseThrow(() -> new RuntimeException("Prodotto non trovato!"));
            
            //debugging: Stampo informazioni utili per capire cosa sta succedendo durante il checkout        
            System.out.println("DEBUG - Prodotto: " + prodotto.getNome());
            System.out.println("DEBUG - Prezzo Unitario: " + prodotto.getPrezzo());
            System.out.println("DEBUG - Quantità richiesta: " + item.getQuantita());
            // CONTROLLO DI SICUREZZA: Prevenzione NullPointerException se il prezzo è mancante
            if (prodotto.getPrezzo() == null) {
                throw new RuntimeException("Errore critico: il prezzo del prodotto " + prodotto.getNome() + " non è definito.");
            }

            // 3. Controllo se c'è abbastanza olio in magazzino per questo specifico prodotto (LOGICA IMPORTANTE)
            if (prodotto.getQuantitaDisponibile() < item.getQuantita()) {
                throw new RuntimeException("Quantità non sufficiente in magazzino per: " + prodotto.getNome());
            }

            // 4. Scalo la quantità venduta e aggiorno l'inventario
            prodotto.setQuantitaDisponibile(prodotto.getQuantitaDisponibile() - item.getQuantita());
            prodottoRepository.save(prodotto); 

            // Sommo il costo di questo prodotto al totale complessivo dell'ordine
            totaleCalcolato += (prodotto.getPrezzo() * item.getQuantita());
           
            // --- AGGIUNTA DI DEBUG: Stampa il totale parziale ---
            System.out.println("DEBUG - Totale parziale accumulato: " + totaleCalcolato);
        }

        // 5. Assemblo l'ordine finale con i campi esatti del tuo Model
        Ordine nuovoOrdine = new Ordine();
        nuovoOrdine.setUtente(utente);
        nuovoOrdine.setDataOrdine(LocalDateTime.now()); // Imposta la data e l'ora attuali
        
        // Imposto il totale ricalcolato dinamicamente su tutti i prodotti
        nuovoOrdine.setTotale(totaleCalcolato);
        
        nuovoOrdine.setStato("ricevuto"); 

        // Salvataggio dati di spedizione ricevuti dal DTO
        nuovoOrdine.setIndirizzoSpedizione(checkoutData.getIndirizzoSpedizione());
        nuovoOrdine.setCitta(checkoutData.getCitta());
        nuovoOrdine.setCap(checkoutData.getCap());
        
        Ordine salvato = ordineRepository.save(nuovoOrdine);
        System.out.println("DEBUG - Ordine salvato con ID: " + salvato.getId() + " e Totale: " + salvato.getTotale());
        
        return salvato;
    }

    // Questo metodo NON necessita di @Transactional perché esegue una sola operazione di lettura (SELECT)
    @Transactional(readOnly = true) 
    public List<Ordine> trovaOrdiniPerUtente(String email) {
        // Chiamo il nuovo metodo che mi restituisce gli ordini già ordinati cronologicamente
        return ordineRepository.findByUtenteEmailOrderByDataOrdineDesc(email);    
    }

    // --- NUOVI METODI PER LA DASHBOARD ADMIN ---

    // Io recupero tutti gli ordini presenti nel database per la dashboard
    @Transactional(readOnly = true)
    public List<Ordine> findAll() {
        return ordineRepository.findAll();
    }

    // Io aggiorno lo stato dell'ordine specifico quando l'admin interviene
    @Transactional
    public void aggiornaStato(Long id, String nuovoStato) {
        Ordine ordine = ordineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ordine non trovato"));
        ordine.setStato(nuovoStato);
        ordineRepository.save(ordine);
    }
}