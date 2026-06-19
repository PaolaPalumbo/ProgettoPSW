package com.oleumfamiliae.backend.dto;

public class JwtResponse {
    private String token;
    private String ruolo;

    public JwtResponse(String token, String ruolo) {
        this.token = token;
        this.ruolo = ruolo;
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
}