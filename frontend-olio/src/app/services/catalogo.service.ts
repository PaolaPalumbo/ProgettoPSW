import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    // Usiamo PUT passando la quantità come parametro nell'URL
    return this.http.put(`${this.apiUrl}/${id}/quantita?quantita=${quantita}`, {});
  }
}