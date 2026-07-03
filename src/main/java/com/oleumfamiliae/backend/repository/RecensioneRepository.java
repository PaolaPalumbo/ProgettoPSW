package com.oleumfamiliae.backend.repository;

import com.oleumfamiliae.backend.model.Recensione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecensioneRepository extends JpaRepository<Recensione, Long> {

    // 1. Per il Catalogo (Frontend lato Utente):
    // Estrae SOLO le recensioni approvate per un dato prodotto
    List<Recensione> findByProdotto_IdAndApprovataTrue(Long prodottoId);

    // 2. Per il Pannello di Amministrazione (Frontend lato Admin):
    // Ottimizzato con JOIN FETCH per prevenire il problema N+1 e caricare tutto in una singola query
    @Query("SELECT r FROM Recensione r JOIN FETCH r.prodotto JOIN FETCH r.utente WHERE r.approvata = false")
    List<Recensione> findByApprovataFalse();

    List<Recensione> findByProdottoId(Long prodottoId);

    // Io cerco le recensioni associate all'email dell'utente
    List<Recensione> findByUtenteEmail(String email);
}



//PUNTO 2.
/*Se non ci fosse la JOIN FETCH, Hybernate genererebbe il problema N+1, ossia, per ogni recensione trovata, verrebbe eseguita una query
 separata per caricare i dati associati. Questo porterebbe a un notevole calo di prestazioni, soprattutto con grandi quantità di dati dovuto
 dal numero di query fatte nel DB. Con JOIN FETCH, invece, tutte le entità correlate vengono caricate in una singola query.*/