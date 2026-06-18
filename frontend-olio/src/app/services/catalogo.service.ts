import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Aggiunto HttpHeaders
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  // Questo è l'indirizzo esatto del tuo backend
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
      'Authorization': `Bearer ${token}`
    });

    // Usiamo PUT passando la quantità come parametro nell'URL e includendo gli headers
    return this.http.put(`${this.apiUrl}/${id}/quantita?quantita=${quantita}`, {}, { headers: headers });
  }
}