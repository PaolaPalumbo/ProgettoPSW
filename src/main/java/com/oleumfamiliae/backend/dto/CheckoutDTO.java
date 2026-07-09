package com.oleumfamiliae.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CheckoutDTO {//contenitore per l'inoltro dell'ordine
    
    // Costruttore vuoto obbligatorio per Spring Boot
    public CheckoutDTO() {}

    @JsonProperty("prodotti")//mi da il controllo totale sulla forma del messaggio
    private List<ItemDTO> prodotti; 
    
    @JsonProperty("indirizzoSpedizione")
    private String indirizzoSpedizione;
    
    @JsonProperty("citta")
    private String citta;
    
    @JsonProperty("cap")
    private String cap;

    // Getter e Setter
    public List<ItemDTO> getProdotti() { return prodotti; }
    public void setProdotti(List<ItemDTO> prodotti) { this.prodotti = prodotti; }

    public String getIndirizzoSpedizione() { return indirizzoSpedizione; }
    public void setIndirizzoSpedizione(String indirizzoSpedizione) { this.indirizzoSpedizione = indirizzoSpedizione; }

    public String getCitta() { return citta; }
    public void setCitta(String citta) { this.citta = citta; }

    public String getCap() { return cap; }
    public void setCap(String cap) { this.cap = cap; }
}