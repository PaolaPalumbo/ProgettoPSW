package com.oleumfamiliae.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Recensione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer voto; // Es: da 1 a 5 stelle
    
    private String commento;

    private boolean approvata = false; // Di default la recensione è "in attesa"

    public boolean isApprovata() {
        return approvata;
    }

    public void setApprovata(boolean approvata) {
        this.approvata = approvata;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVoto() {
        return voto;
    }

    public void setVoto(Integer voto) {
        this.voto = voto;
    }

    public String getCommento() {
        return commento;
    }

    public void setCommento(String commento) {
        this.commento = commento;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public Prodotto getProdotto() {
        return prodotto;
    }

    public void setProdotto(Prodotto prodotto) {
        this.prodotto = prodotto;
    }


    //@ManyToOne
    // indica che molte istanze della classe in cui si trova l'annotazione possono 
    // essere associate a una singola istanza di un'altra classe.

    @ManyToOne // L'utente che ha scritto la recensione
    private Utente utente;

    @ManyToOne // Il formato di olio che è stato recensito
    private Prodotto prodotto;

}