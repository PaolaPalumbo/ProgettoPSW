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
public class UserDetailsServiceImpl implements UserDetailsService {//funge da anello tra il DB e il motore di sicurezza di Spring-boot

    private final UtenteRepository utenteRepository;

    public UserDetailsServiceImpl(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }

    // Questo è il metodo che Spring Security chiama in automatico dietro le quinte
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        // 1. Vado a pescare il mio Utente dal database usando l'email (che funge da username)
        Utente utente = utenteRepository.findByEmail(email)//cerco l'utente
                .orElseThrow(() -> new UsernameNotFoundException("Nessun utente trovato con email: " + email));

        // 2. Converto il mio Utente nell'oggetto User standard di Spring Security (Adapter Pattern)
        return new org.springframework.security.core.userdetails.User(
                utente.getEmail(),//estraggo i dati dal model: utente
                utente.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );                              //definisco i poteri dell'utente
    }
}
//Una volta creata, una singletonList non può essere modificata: non posso aggiungere altri ruoli, 
//non poss rimuoverli, non puoi svuotare la lista.--->

/*Spring Security si aspetta che la lista dei ruoli di un utente non cambi "di nascosto" durante la vita della richiesta. 
Se fosse una lista normale (ArrayList), una parte del codice potrebbe inavvertitamente aggiungere o rimuovere permessi. 
Con singletonList, ho la garanzia matematica che, una volta definita nel momento del caricamento dal database, l'elenco dei ruoli 
rimarrà esattamente quello. */



/*UTILIZZO IL DESIGN PATTER ADAPTER, in quanto, normalizza le entità del dominio (Utente) nel formato UserDetails richiesto 
dal contesto di sicurezza, permettendo l'integrazione fluida tra il livello di persistenza dei dati e i meccanismi di autorizzazione
 basati su ruoli.  */