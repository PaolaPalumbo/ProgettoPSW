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
  private readonly STORAGE_KEY = 'oleum_carrello'; // Chiave per il localStorage

  constructor(private http: HttpClient) {
    // ALL'AVVIO: Recupera i dati salvati, se esistono
    const salvati = localStorage.getItem(this.STORAGE_KEY);
    if (salvati) {
      this.articoli = JSON.parse(salvati);
    }
  }

  // --- METODI DI GESTIONE CARRELLO ---

  aggiungi(prodotto: any) {
    this.articoli.push(prodotto);
    this.salvaSuLocalStorage(); // Salvataggio automatico nel localStorage
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
      this.salvaSuLocalStorage(); // Aggiorna il localStorage dopo la rimozione
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
    localStorage.removeItem(this.STORAGE_KEY); // Pulisce anche il localStorage
    // Nota: poiché la Navbar è in ascolto sul getter getNumeroArticoli(), 
    // svuotando l'array il badge del carrello sparirà istantaneamente!
  }

  // Metodo privato per mantenere la sincronia col browser
  private salvaSuLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.articoli));
  }
}