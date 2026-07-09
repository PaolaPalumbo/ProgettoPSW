package com.oleumfamiliae.backend.model;
//JPA mi consente di mappare i file nel DB 


//utilizzo JPA (Jakarta Persistence API) che è una specifica (insieme di regole) per la gestione della persistenza dei dati in Java. 
//JPA è un'API standard che permette di mappare le classi Java agli oggetti del database relazionale, facilitando l'interazione con
// il database senza dover scrivere manualmente query SQL complesse.
//HYBERNATE è un'implementazione concreta di JPA, che fornisce le funzionalità necessarie per gestire la persistenza dei dati
// in un'applicazione Java.------> vedi src/main/resources/application.properties 



import jakarta.persistence.Column;
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
    
    // Imposto un valore di default per garantire che ogni nuovo ordine parta da qui
    @Column(nullable = false) //vincolo di intergrità dei dati
    private String stato = "In elaborazione"; // "In elaborazione", "Spedito" o "Consegnato"

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

    //chiave esterna ordine-utente.
    @ManyToOne // "Molti ordini appartengono a un solo Utente"
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