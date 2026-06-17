package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdineRepository extends JpaRepository<Ordine, Long> {
    // Eredito automaticamente tutti i metodi per salvare e aggiornare gli ordini
    // Query Derivation: Spring genera automaticamente la query SQL corretta
    List<Ordine> findByUtenteEmail(String email);
}

    