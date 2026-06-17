package com.oleumfamiliae.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    
    // La nostra frase segreta
    private static final String jwtSecret = "OleumFamiliaeSecretKey2026OleumFamiliaeSecretKey2026DellaLaureaDiPaolaUnical"; 
    private static final int jwtExpirationMs = 86400000; // 24 ore

    // AGGIUNTO: Metodo helper che trasforma in modo sicuro la stringa in una chiave crittografica
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Genera il token dopo il login
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Usiamo la nuova chiave convertita
            .compact();
    }

    // Estrae l'username dal token
    public String getUserNameFromJwtToken(String token) {
        // AGGIORNATO: Usiamo il nuovo parserBuilder (non più deprecato)
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();
    }

    // Verifica se il token è valido
    public boolean validateJwtToken(String authToken) {
        try {
            // AGGIORNATO: Usiamo il nuovo parserBuilder
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }    
}