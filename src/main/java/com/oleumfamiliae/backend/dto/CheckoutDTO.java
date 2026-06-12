package com.oleumfamiliae.backend.dto;

public class CheckoutDTO {
    
    private Long idUtente;
    private Long idProdotto;
    private int quantita;
    public Long getIdUtente() {
        return idUtente;
    }
    public void setIdUtente(Long idUtente) {
        this.idUtente = idUtente;
    }
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