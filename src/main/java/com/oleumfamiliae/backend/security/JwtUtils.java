package com.oleumfamiliae.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;


//gestisce i token JWT: generazione, estrazione username e validazione
@Component
public class JwtUtils {
    
    // Chiave segreta di esattamente 64 caratteri (512 bit) per l'algoritmo HS512
    //per una app reale, la chiave non va scritta nel codice ma in un ambiente sicuro
    private static final String jwtSecret = "OleumFamiliaeSecretKey2026OleumFamiliaeSecretKey2026LaureaUnical"; //per firmare digitalmente il token
    private static final int jwtExpirationMs = 86400000; // durata validtà del token: 24 ore

    // Metodo helper che trasforma in modo sicuro la stringa in una chiave crittografica
    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);//converte la stringasegreta nello stesso array di byte
        return Keys.hmacShaKeyFor(keyBytes);//chiave di crittografia
    }

    // Genera il token dopo il login
    public String generateJwtToken(Authentication authentication) {
        //authentication contiene già i dati dell'utente validato
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();//ottengo l'identità dell'utente
        
        return Jwts.builder()//asseblo il token con il pattern builder
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())//registra l'istante di creazione del token
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)//il token viene sigillato
            .compact();// compatta il token per inviarlo mediante HTTP ad Angular
    }

    //il server deve capire chi fa richieste
    // Estrae l'username dal token
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())//il parser utilizza la chiave segreta passata al metodo set
            .build()
            .parseClaimsJws(token)//analizza il token, se la firma è corretta, 
            .getBody()//accede al playload
            .getSubject();//legge il campo standard del JWT: username
    }

    // Verifica se il token è valido--->agisce come filtro
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())//come prima, verifico il token mediante la chiave
                .build()
                .parseClaimsJws(authToken);//verifica la firma del token
            return true;//se è alterata lancia l'eccezione
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }    
}

//A primo impatto il metodo validateJwtToken potrebbe sembrare superfluo perchè getUserNameFromJwtToken
//effettua tecnicamente le stesse operazioni di parsing. Tutta via non è così, ad ogni metodo viene assegnato
//un compito: getUserNameFromJwtToken ha compito "estrattivo", mentre validateJwtToken ha compito "decisorio"
//Inoltre SpingSecurity gestisce la sicurezza come una CATENA DI FILTRI:

//1.  Il filtro intercetta la richiesta.
//2.  Il filtro chiama validateJwtToken.
//3.  Se true, il sistema procede a recuperare l'username e autenticare 
//    l'utente nel contesto di Spring.
//4.  Se false, il filtro blocca la richiesta immediatamente.

/*GESTIONE GRANULARE DEGLI ERRORI: La separazione della logica di validazione permette di distinguere nettamente tra diverse 
tipologie di criticità. Ad esempio, è possibile gestire in modo differenziato un token scaduto (che potrebbe innescare una procedura
 di rinnovo automatico tramite refresh token) rispetto a un token malformato o con firma non valida (che segnala un potenziale tentativo 
 di manipolazione o attacco). *///--------> potrei confondere un token scaduto con un token manomesso