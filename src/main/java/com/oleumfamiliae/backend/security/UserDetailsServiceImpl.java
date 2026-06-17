package com.oleumfamiliae.backend.security;

import com.oleumfamiliae.backend.model.Utente;
import com.oleumfamiliae.backend.repository.UtenteRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtenteRepository utenteRepository;

    public UserDetailsServiceImpl(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }

    // Questo è il metodo che Spring Security chiama in automatico dietro le quinte
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        // 1. Vado a pescare il mio Utente dal database usando l'email (che funge da username)
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Nessun utente trovato con email: " + email));

        // 2. Converto il mio Utente nell'oggetto User standard di Spring Security (Adapter Pattern!)
        // Nota bene: Qui gli sto assegnando forzatamente l'autorità "ROLE_ADMIN" per sbloccare il test.
        // In futuro, se aggiungerai un campo "ruolo" alla classe Utente, potrai leggerlo dinamicamente da lì!
        return new org.springframework.security.core.userdetails.User(
                utente.getEmail(),
                utente.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }
}