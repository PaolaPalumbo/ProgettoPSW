package com.oleumfamiliae.backend.dto;

public class ItemDTO {//prodotti nel carrello
    private Long idProdotto;
    private int quantita;
    public Long getIdProdotto() {
        return idProdotto;
    }
    public void setIdProdotto(Long idProdotto) {
        this.idProdotto = idProdotto;
    }
    public int getQuantita() {
        return quantita;
    }
    public void setQuantita(int quantita) {
        this.quantita = quantita;
    }
    
}