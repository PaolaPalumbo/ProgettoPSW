import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // <-- IMPORTANTE: Aggiunto BehaviorSubject
import { CheckoutDTO } from '../models/checkout.dto'; 

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  private articoli: any[] = []; 
  private apiUrl = 'http://localhost:8080/api/ordini';
  private readonly STORAGE_KEY = 'oleum_carrello'; 

  // --- IL CUORE DELLA REATTIVITÀ ---
  private contatoreSubject = new BehaviorSubject<number>(0);
  contatore$ = this.contatoreSubject.asObservable();

  constructor(private http: HttpClient) {
    // ALL'AVVIO: Recupera i dati salvati, se esistono
    const salvati = localStorage.getItem(this.STORAGE_KEY);
    if (salvati) {
      this.articoli = JSON.parse(salvati);
      // Sincronizza il contatore all'avvio con i dati appena recuperati dal localStorage
      this.contatoreSubject.next(this.articoli.length); 
    }
  }

  // --- METODI DI GESTIONE CARRELLO ---

  aggiungi(prodotto: any) {
    this.articoli.push(prodotto);
    this.salvaSuLocalStorage(); 
    this.contatoreSubject.next(this.articoli.length); // <-- Avvisa la Navbar!
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
      this.salvaSuLocalStorage(); 
      this.contatoreSubject.next(this.articoli.length); // <-- Avvisa la Navbar!
    }
  }

  // --- NUOVI METODI PER IL CHECKOUT ---

  // 1. Chiamata API per processare l'ordine
  effettuaCheckout(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, payload);
  }

  // 2. State Reset: Svuota la memoria locale dopo un acquisto con successo
  svuotaCarrello(): void {
    this.articoli = [];
    localStorage.removeItem(this.STORAGE_KEY); 
    this.contatoreSubject.next(0); // <-- Azzera il numerino istantaneamente
  }

  // Metodo privato per mantenere la sincronia col browser
  private salvaSuLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.articoli));
  }
}