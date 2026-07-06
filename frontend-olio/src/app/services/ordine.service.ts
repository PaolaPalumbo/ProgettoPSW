import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdineService {
  
  // L'indirizzo del nostro backend Spring Boot
  private apiUrl = 'http://localhost:8080/api/ordini';

  constructor(private http: HttpClient) {}

  // --- METODI PER I CLIENTI ---

  // Invia il carrello al server per processare l'acquisto
  effettuaCheckout(checkoutData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, checkoutData);
  }

  // Recupera la cronologia ordini dell'utente loggato
  getOrdiniMiei(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/miei`);
  }


  // --- METODI PER LA DASHBOARD ADMIN ---

  // Recupera l'elenco completo di tutti gli ordini del sistema
  getTuttiGliOrdini(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tutti`);
  }

  // Aggiorna lo stato di elaborazione/spedizione di un ordine specifico
  aggiornaStatoOrdine(id: number, nuovoStato: string): Observable<any> {
    // Uso HttpParams per costruire l'URL in modo pulito e sicuro: Angular applica automaticamente il processo di URL Encoding. 
    // Se intercetta uno spazio o un carattere speciale, lo traduce in un formato sicuro e universalmente leggibile sul web
    const params = new HttpParams().set('stato', nuovoStato);
    return this.http.put(`${this.apiUrl}/${id}/stato`, {}, { params });
  }
}