import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getRecensioniDaApprovare(): Observable<Recensione[]> {
    return this.http.get<Recensione[]>(`${this.apiUrl}/da-approvare`);
  }

  // Metodo per l'amministratore: approva una recensione specifica
  approva(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/approva/${id}`, {});
  }
}