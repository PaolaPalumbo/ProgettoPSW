package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Long> {
    // Questo metodo personalizzato cercherà un utente tramite la sua email.
    // Utile nell'implementazione nella fase di Login e Sicurezza
    
    Optional<Utente> findByEmail(String email);
}
