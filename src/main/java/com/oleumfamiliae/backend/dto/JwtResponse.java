package com.oleumfamiliae.backend.dto;

public class JwtResponse {//isola la logica di autentificazione, separando le credenziali dai dati business
    private String token;
    private String ruolo;
    private Long id; // Campo per contenere l'ID dell'utente

    // Aggiornato il costruttore per accogliere il nuovo parametro id
    public JwtResponse(String token, String ruolo, Long id) {
        this.token = token;
        this.ruolo = ruolo;
        this.id = id;
    }

    public String getToken() { 
        return token; 
    }
    
    public void setToken(String token) { 
        this.token = token; 
    }

    public String getRuolo() { 
        return ruolo; 
    }
    
    public void setRuolo(String ruolo) { 
        this.ruolo = ruolo; 
    }

    // AGGIUNTO: Getter per l'ID
    public Long getId() {
        return id;
    }

    // AGGIUNTO: Setter per l'ID
    public void setId(Long id) {
        this.id = id;
    }
}