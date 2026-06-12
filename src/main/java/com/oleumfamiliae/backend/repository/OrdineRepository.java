package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdineRepository extends JpaRepository<Ordine, Long> {
    // Eredito automaticamente tutti i metodi per salvare e aggiornare gli ordini
}