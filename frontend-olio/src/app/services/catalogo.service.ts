import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Aggiunto HttpParams
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  // Questo è l'indirizzo esatto del backend
  private apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private http: HttpClient) { }

  // Metodo per recuperare la lista dei prodotti
  getProdotti(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  aggiornaQuantita(id: number, quantita: number) {
    // Recupera il token dal localStorage per autorizzare la richiesta
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Usiamo HttpParams per gestire i parametri della query in modo sicuro
    const params = new HttpParams().set('quantita', quantita.toString());

    // La rotta corretta è ${this.apiUrl}/${id}/quantita
    // Angular aggiungerà automaticamente ?quantita=... in modo pulito
    return this.http.put(`${this.apiUrl}/${id}/quantita`, {}, { headers, params });
  }
}