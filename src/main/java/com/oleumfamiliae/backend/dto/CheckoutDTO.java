package com.oleumfamiliae.backend.dto;

import java.util.List;

public class CheckoutDTO {
    
    // Mantieni SOLO quello che invii dal frontend
    private List<ItemDTO> prodotti; 
    private String indirizzoSpedizione;
    private String citta;
    private String cap;

    // Getter e Setter SOLO per questi campi
    public List<ItemDTO> getProdotti() { return prodotti; }
    public void setProdotti(List<ItemDTO> prodotti) { this.prodotti = prodotti; }

    public String getIndirizzoSpedizione() { return indirizzoSpedizione; }
    public void setIndirizzoSpedizione(String indirizzoSpedizione) { this.indirizzoSpedizione = indirizzoSpedizione; }

    public String getCitta() { return citta; }
    public void setCitta(String citta) { this.citta = citta; }

    public String getCap() { return cap; }
    public void setCap(String cap) { this.cap = cap; }
}