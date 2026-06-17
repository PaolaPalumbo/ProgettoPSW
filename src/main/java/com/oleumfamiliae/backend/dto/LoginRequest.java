package com.oleumfamiliae.backend.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Costruttore vuoto (obbligatorio per Spring)
    public LoginRequest() {}

    // --- GETTER E SETTER ---
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}