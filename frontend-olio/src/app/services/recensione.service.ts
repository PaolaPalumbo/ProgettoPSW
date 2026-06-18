import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recensione } from '../models/recensione.model'; // Assicurati che il percorso sia corretto

@Injectable({
  providedIn: 'root'
})
export class RecensioneService {

  // Questo è l'URL del tuo backend che abbiamo testato con Thunder Client!
  private apiUrl = 'http://localhost:8080/api/recensioni';

  constructor(private http: HttpClient) { }

  // 1. Invia una nuova recensione al database
  inviaRecensione(recensione: Recensione): Observable<Recensione> {
    return this.http.post<Recensione>(this.apiUrl, recensione);
  }

  // 2. Recupera le recensioni approvate per un determinato prodotto
  getRecensioniProdotto(prodottoId: number): Observable<Recensione[]> {
    // Supponendo che il tuo controller Spring Boot abbia un endpoint tipo /api/recensioni/prodotto/1
    return this.http.get<Recensione[]>(`${this.apiUrl}/prodotto/${prodottoId}`);
  }

  // Metodo per l'amministratore: recupera tutte le recensioni in attesa
  // <-- MODIFICATO: Rinominato per farlo combaciare con admin-dashboard.ts
  getRecensioniInAttesa(): Observable<Recensione[]> {
    // AGGIUNTO: Recupero il token per superare la sicurezza del backend
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Recensione[]>(`${this.apiUrl}/da-approvare`, { headers: headers });
  }

  // Metodo per l'amministratore: approva una recensione specifica
  approva(id: number): Observable<any> {
    // AGGIUNTO: Recupero il token dal localStorage per la chiamata protetta da ROLE_ADMIN
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Se sul backend hai mappato l'approvazione come PUT, sostituisci .post con .put
    return this.http.post(`${this.apiUrl}/approva/${id}`, {}, { headers: headers });
  }
}