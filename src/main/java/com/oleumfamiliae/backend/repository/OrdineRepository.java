package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Ordine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdineRepository extends JpaRepository<Ordine, Long> {
    
    // Eredito automaticamente tutti i metodi base per salvare e aggiornare i miei ordini
    
    // Query Derivation: Spring genera automaticamente la query SQL corretta.
    // AGGIORNAMENTO: Ho aggiunto "OrderByDataDesc" così il database mi restituisce 
    // la cronologia già ordinata, dal mio acquisto più recente a quello più vecchio.
    List<Ordine> findByUtenteEmailOrderByDataOrdineDesc(String email);
    //nomenclatura standardizzata FINDBY
}