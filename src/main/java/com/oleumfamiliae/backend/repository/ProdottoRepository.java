package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {
    // Eredito  automaticamente tutti i metodi per gestire l'inventario dell'olio
}
