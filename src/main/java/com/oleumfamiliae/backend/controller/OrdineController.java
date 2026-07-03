package com.oleumfamiliae.backend.controller;

import java.util.List;
import java.util.stream.Collectors; // Aggiunto per poter convertire la lista
import com.oleumfamiliae.backend.dto.CheckoutDTO;
import com.oleumfamiliae.backend.dto.OrdineResponseDTO; // Importo la "busta" per la cronologia
import com.oleumfamiliae.backend.model.Ordine;
import com.oleumfamiliae.backend.service.OrdineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController //scambio di dati JSON mediante DTO
@RequestMapping("/api/ordini")//definisce la rotta
@CrossOrigin(origins = "http://localhost:4200")//app Angular dialoga con il backend evitando CORS
public class OrdineController {

    private final OrdineService ordineService;

    
    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @PostMapping("/checkout")//client invia blocco di dati
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')") // Proteggo la rotta per evitare acquisti anonimi
    public ResponseEntity<?> effettuaCheckout(@RequestBody CheckoutDTO checkoutData) { //REQUESTBODY mappa i playload alla richiesta http, nel DTO
        //RICORDA: HTTP è il mezzo di trasporto, il protocollo RESTFUL definisce le regole di comunicazione, 
        // il DTO è la "busta" che trasporta i dati tra frontend e backend.
        try {
            // Estraggo l'email dal token per evitare frodi sull'idUtente
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            //SECURITYCONTEXHOLDER agisce come repository globale:
            //identifica l'utente risalendo alla sua identità 
            //mediante il token JWT neutralizzando i tentativi di frode sull'identità


            // Passo semplicemente la "busta" (DTO) al mio Service.
            // Sarà il Service a recuperare le entità e applicare la logica in totale isolamento.
            Ordine ordineSalvato = ordineService.effettuaCheckout(checkoutData, email); 
            
            //RESPONSENTITY mi permette di incapsulare l'ordine per dare al frontend
            //info relative al suo successo o al suo fallimento
            return ResponseEntity.ok(ordineSalvato);
        } catch (Exception e) {
            // Se il mio Service lancia un'eccezione (es. "Quantità non sufficiente"), 
            // rispondo al frontend con un errore 400.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Espongo l'endpoint per la mia cronologia ordini protetto da autorizzazione.
    // Utilizzo il SecurityContextHolder per estrarre la mia identità dal token JWT,
    // garantendo un approccio stateless e sicuro che evita l'esposizione di parametri manipolabili.

    @GetMapping("/miei")// il DB fornisce il blocco di dati al frontend
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrdineResponseDTO>> getOrdiniMiei() {
        // 1. Estraggo la mia email dal contesto di sicurezza (il token JWT)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Chiedo al Service di trovare i miei ordini
        List<Ordine> ordini = ordineService.trovaOrdiniPerUtente(email);
        
        // 3. Converto le entità pesanti del DB in DTO leggeri e sicuri per il mio frontend
        List<OrdineResponseDTO> ordiniDTO = ordini.stream()
            .map(ordine -> new OrdineResponseDTO(
                ordine.getId(),
                ordine.getDataOrdine(),
                ordine.getTotale(),
                ordine.getStato() //Trasporto lo stato nel DTO per il frontend!
            ))
            .collect(Collectors.toList());
            
        // 4. Restituisco la lista pronta per la mia tabella Angular
        return ResponseEntity.ok(ordiniDTO);
    }

    // ---ENDPOINT PER LA GESTIONE SPEDIZIONI (AREA ADMIN) ---

    // Espongo un endpoint riservato all'amministratore per recuperare l'intera lista degli ordini
    @GetMapping("/tutti") //tutti gli ordini
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ordine>> getAllOrdini() {
        // Chiedo al mio Service di estrarre tutti i record presenti nel database
        return ResponseEntity.ok(ordineService.getTuttiGliOrdini());
    }

    // Espongo un endpoint per aggiornare lo stato di un ordine specifico, sempre protetto per l'admin
    @PutMapping("/{id}/stato")//aggiorna i dati nel DB: il frontend invia dei dati al beckend
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> aggiornaStato(@PathVariable Long id, @RequestParam String stato) {//i due tag estraggono i parametri dinamici direttamente dall'URL
        try {
            // Delego al Service l'aggiornamento dell'entità
            Ordine aggiornato = ordineService.aggiornaStatoOrdine(id, stato);
            return ResponseEntity.ok(aggiornato);
        } catch (Exception e) {
            // In caso di errore (es. ordine non trovato o errore server), restituisco un 500 con il dettaglio
            return ResponseEntity.internalServerError().body("Errore durante l'aggiornamento dello stato: " + e.getMessage());
        }
    }
}