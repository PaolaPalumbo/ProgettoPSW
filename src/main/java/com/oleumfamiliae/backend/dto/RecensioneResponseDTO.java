package com.oleumfamiliae.backend.dto;

public class RecensioneResponseDTO {
    private Long id; // AGGIUNTO: Campo per identificare la recensione
    private String nomeProdotto;
    private int voto;
    private String commento;
    private boolean approvata; // Nuovo campo

    public RecensioneResponseDTO(Long id, String nomeProdotto, int voto, String commento, boolean approvata) {
        this.id = id; // Inizializzato nel costruttore
        this.nomeProdotto = nomeProdotto;
        this.voto = voto;
        this.commento = commento;
        this.approvata = approvata;
    }

    // Getter
    public Long getId() { return id; } // Getter per l'id
    public String getNomeProdotto() { return nomeProdotto; }
    public int getVoto() { return voto; }
    public String getCommento() { return commento; }
    public boolean isApprovata() { return approvata; } // Getter per il booleano
}