package com.oleumfamiliae.backend.dto;

import java.time.LocalDateTime; // o LocalDateTime in base a cosa usi nella tua entità
import java.math.BigDecimal; // o Double

public class OrdineResponseDTO {
    private Long id;
    private LocalDateTime data;
    private Double totale;

    // Costruttore vuoto
    public OrdineResponseDTO() {}

    // Costruttore con parametri
    public OrdineResponseDTO(Long id, LocalDateTime data, Double totale) {
        this.id = id;
        this.data = data;
        this.totale = totale;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public Double getTotale() { return totale; }
    public void setTotale(Double totale) { this.totale = totale; }
}