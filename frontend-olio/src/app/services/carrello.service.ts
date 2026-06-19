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

  // ... (mantieni i tuoi metodi attuali: aggiungi, rimuovi, getArticoli, getNumeroArticoli, ecc.) ...

  // --- NUOVI METODI PER IL CHECKOUT ---

  // 1. Chiamata API per processare l'ordine
  // --- MODIFICATO: Ora accetta un array di CheckoutDTO[] ---
  effettuaCheckout(carrelloDTO: CheckoutDTO[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, carrelloDTO);
    }

  // 2. State Reset: Svuota la memoria locale dopo un acquisto con successo
  svuotaCarrello(): void {
    this.articoli = [];
    // Nota: poiché la Navbar è in ascolto sul getter getNumeroArticoli(), 
    // svuotando l'array il badge del carrello sparirà istantaneamente!
  }
}