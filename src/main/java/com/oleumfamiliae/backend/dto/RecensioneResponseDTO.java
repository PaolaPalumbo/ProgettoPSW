package com.oleumfamiliae.backend.dto;

public class RecensioneResponseDTO {
    private String nomeProdotto;
    private int voto;
    private String commento;
    private boolean approvata; // Nuovo campo

    public RecensioneResponseDTO(String nomeProdotto, int voto, String commento, boolean approvata) {
        this.nomeProdotto = nomeProdotto;
        this.voto = voto;
        this.commento = commento;
        this.approvata = approvata;
    }

    // Getter
    public String getNomeProdotto() { return nomeProdotto; }
    public int getVoto() { return voto; }
    public String getCommento() { return commento; }
    public boolean isApprovata() { return approvata; } // Getter per il booleano
}