package com.oleumfamiliae.backend.model;
//Trasfomo la classe in una vera e propria entità JPA, ovvero creo
//una tabella nel database che rappresenta gli utenti, 
// con o campi id, nome, cognome, email e password.

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity //dice a Spring che questa classe rappresenta una tabella nel database
public class Utente {

    //indica che questo campo è la chiave primaria della tabella
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    //Comlumn  mi consente di imporre delle regole: la mail può essere
    // vuota (null) e deve essere unica, mentre la password non può essere null
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nome;
    
    private String cognome;
    
    private String indirizzoSpedizione;



    // per accedere alle variabili private, creo i getter e setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getIndirizzoSpedizione() {
        return indirizzoSpedizione;
    }

    public void setIndirizzoSpedizione(String indirizzoSpedizione) {
        this.indirizzoSpedizione = indirizzoSpedizione;
    }

}