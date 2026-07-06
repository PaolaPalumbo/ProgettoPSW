import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Aggiunto HttpParams
import { Observable } from 'rxjs';

@Injectable({//tag che permette alla classa di partecipare al sistema di Dependency Injection
  providedIn: 'root' //singleton: Crea una sola identica copia di questo CatalogoService e usala per tutti
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

    // Uso HttpParams per gestire i parametri della query in modo sicuro
    const params = new HttpParams().set('quantita', quantita.toString());

  
    // Angular aggiungere automaticamente ?quantita=... in modo pulito
    return this.http.put(`${this.apiUrl}/${id}/quantita`, {}, { headers, params });
  }
}