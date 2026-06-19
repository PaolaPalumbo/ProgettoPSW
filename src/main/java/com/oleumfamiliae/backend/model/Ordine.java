package com.oleumfamiliae.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class Ordine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataOrdine;
    
    private Double totale;
    
    private String stato; // "ricevuto", "spedito" o "consegnato"

    private String indirizzoSpedizione;
    
    private String citta;

    private String cap;

    public String getIndirizzoSpedizione() {
        return indirizzoSpedizione;
    }

    public void setIndirizzoSpedizione(String indirizzoSpedizione) {
        this.indirizzoSpedizione = indirizzoSpedizione;
    }

    public String getCitta() {
        return citta;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    
    @ManyToOne // Questa è una Relazione: Significa che "Molti ordini appartengono a un solo Utente"
    private Utente utente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataOrdine() {
        return dataOrdine;
    }

    public void setDataOrdine(LocalDateTime dataOrdine) {
        this.dataOrdine = dataOrdine;
    }

    public Double getTotale() {
        return totale;
    }

    public void setTotale(Double totale) {
        this.totale = totale;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

   
}