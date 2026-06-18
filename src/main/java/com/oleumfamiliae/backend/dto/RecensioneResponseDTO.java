package com.oleumfamiliae.backend.dto;

public class RecensioneResponseDTO {
    private String nomeProdotto;
    private int voto;
    private String commento;

    public RecensioneResponseDTO(String nomeProdotto, int voto, String commento) {
        this.nomeProdotto = nomeProdotto;
        this.voto = voto;
        this.commento = commento;
    }

    // Getter
    public String getNomeProdotto() { return nomeProdotto; }
    public int getVoto() { return voto; }
    public String getCommento() { return commento; }
}