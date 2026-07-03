package com.oleumfamiliae.backend.dto;

import java.time.LocalDateTime; // o LocalDateTime in base a cosa usi nella tua entità
import java.math.BigDecimal; // o Double


//CRONOLOGIA ORDINI
public class OrdineResponseDTO {//trasporta per il backend e mostra per il frontend la cronologia degli ordini
    private Long id;
    private LocalDateTime data;
    private Double totale;
    private String stato; // Trasporta lo stato dell'ordine

    // Costruttore vuoto
    public OrdineResponseDTO() {}

    // Costruttore con parametri
    public OrdineResponseDTO(Long id, LocalDateTime data, Double totale, String stato) {
        this.id = id;
        this.data = data;
        this.totale = totale;
        this.stato = stato; 
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public Double getTotale() { return totale; }
    public void setTotale(Double totale) { this.totale = totale; }

    // <-- AGGIUNTI: Getter e Setter per lo stato
    public String getStato() { return stato; }
    public void setStato(String stato) { this.stato = stato; }
}