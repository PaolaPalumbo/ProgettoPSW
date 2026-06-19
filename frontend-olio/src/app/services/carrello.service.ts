import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutDTO } from '../models/checkout.dto'; // Aggiusta il percorso

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  private articoli: any[] = []; // Sostituisci 'any' con la tua interfaccia Prodotto se la usi
  private apiUrl = 'http://localhost:8080/api/ordini';

  constructor(private http: HttpClient) {}

  // --- METODI DI GESTIONE CARRELLO ---

  aggiungi(prodotto: any) {
    this.articoli.push(prodotto);
    console.log('Prodotto aggiunto al carrello:', prodotto);
  }

  getArticoli(): any[] {
    return this.articoli;
  }

  getNumeroArticoli(): number {
    return this.articoli.length;
  }

  rimuovi(prodotto: any) {
    const index = this.articoli.findIndex(a => a.id === prodotto.id);
    if (index > -1) {
      this.articoli.splice(index, 1);
    }
  }

  // --- NUOVI METODI PER IL CHECKOUT ---

  // 1. Chiamata API per processare l'ordine
  // --- MODIFICATO: Ora accetta un array di CheckoutDTO[] ---
  effettuaCheckout(payload: any): Observable<any> {
    // L'URL rimane /checkout, ma ora invii l'oggetto con tutti i dati
    return this.http.post(`${this.apiUrl}/checkout`, payload);
  }

  // 2. State Reset: Svuota la memoria locale dopo un acquisto con successo
  svuotaCarrello(): void {
    this.articoli = [];
    // Nota: poiché la Navbar è in ascolto sul getter getNumeroArticoli(), 
    // svuotando l'array il badge del carrello sparirà istantaneamente!
  }
}