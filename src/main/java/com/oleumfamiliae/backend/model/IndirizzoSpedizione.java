package com.oleumfamiliae.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class IndirizzoSpedizione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String indirizzoSpedizione; // via e numero civico
    private String citta;
    private String cap;
    private String nomeIndirizzo; // Es. "Casa", "Lavoro" per distinguerli

    // Chiave esterna: molti indirizzi appartengono a un solo Utente
    @ManyToOne
    private Utente utente;

    // --- GETTER E SETTER ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getNomeIndirizzo() {
        return nomeIndirizzo;
    }

    public void setNomeIndirizzo(String nomeIndirizzo) {
        this.nomeIndirizzo = nomeIndirizzo;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }
}