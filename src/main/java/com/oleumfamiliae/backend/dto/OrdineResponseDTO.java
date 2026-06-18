package com.oleumfamiliae.backend.dto;

import java.time.LocalDate; // o LocalDateTime in base a cosa usi nella tua entità
import java.math.BigDecimal; // o Double

public class OrdineResponseDTO {
    private Long id;
    private LocalDate data;
    private Double totale;

    // Costruttore vuoto
    public OrdineResponseDTO() {}

    // Costruttore con parametri
    public OrdineResponseDTO(Long id, LocalDate data, Double totale) {
        this.id = id;
        this.data = data;
        this.totale = totale;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public Double getTotale() { return totale; }
    public void setTotale(Double totale) { this.totale = totale; }
}