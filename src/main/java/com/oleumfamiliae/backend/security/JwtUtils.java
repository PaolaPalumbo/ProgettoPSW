package com.oleumfamiliae.backend.security; // Assicurati che il package sia corretto

import io.jsonwebtoken.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.SignatureException;
import java.util.Date;

@Component
public class JwtUtils {
    
    // Una chiave segreta di almeno 512 bit per l'algoritmo HS512
    private static final String jwtSecret = "OleumFamiliaeSecretKey2026OleumFamiliaeSecretKey2026"; 
    private static final int jwtExpirationMs = 86400000; // 24 ore

    // Genera il token dopo il login
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    // Estrae l'username dal token per verificare chi sta chiamando l'API
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    // Verifica se il token è valido e non scaduto
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // JwtException cattura SignatureException, ExpiredJwtException, etc.
            // IllegalArgumentException cattura token vuoti o nulli
            return false;
        }
    }    
}