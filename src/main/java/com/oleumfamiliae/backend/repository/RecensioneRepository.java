package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Recensione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecensioneRepository extends JpaRepository<Recensione, Long> {

    // 1. Per il Catalogo (Frontend lato Utente):
    // Estrae SOLO le recensioni approvate per un dato prodotto
    List<Recensione> findByProdotto_IdAndApprovataTrue(Long prodottoId);

    // 2. Per il Pannello di Amministrazione (Frontend lato Admin):
    // Estrae tutte le recensioni che sono ancora in attesa di moderazione (approvata = false)
    List<Recensione> findByApprovataFalse();

    List<Recensione> findByProdottoId(Long prodottoId);

    // Io cerco le recensioni associate all'email dell'utente
    List<Recensione> findByUtenteEmail(String email);
}
//rafforza incaspulamento
//Si elimina il rischio di esporre accidentalmente dati sensibili o non validati tramite le API pubbliche


//findBy è la firma del metodo che consente a JPA di trasformare 
//il metodo in query SQL