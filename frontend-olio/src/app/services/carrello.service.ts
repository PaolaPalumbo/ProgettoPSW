import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // <-- IMPORTANTE: Aggiunto BehaviorSubject
import { CheckoutDTO } from '../models/checkout.dto'; 

@Injectable({// permette alla classa di partecipare al sistema di Dependency Injection
  providedIn: 'root' //creo il SINGLETON: Crea una sola identica copia di questo CarrelloService e usala per tutti
})
export class CarrelloService {
  private articoli: any[] = []; 
  private apiUrl = 'http://localhost:8080/api/ordini';
  private readonly STORAGE_KEY = 'oleum_carrello'; 

  // --- IL CUORE DELLA REATTIVITÀ ---
  private contatoreSubject = new BehaviorSubject<number>(0); //inizilizzo il BeahviorSubject
  contatore$ = this.contatoreSubject.asObservable();//il componente Carrello si mette in ascolto nel canale

  constructor(private http: HttpClient) {
    // ALL'AVVIO: Recupera i dati salvati, se esistono
    const salvati = localStorage.getItem(this.STORAGE_KEY);
    if (salvati) {
      //prende il testo JSON e lo ritrasforma nel vero e proprio array di oggetti TypeScript originale:
      this.articoli = JSON.parse(salvati);//DESERIALIZZAZIONE
      // Sincronizza il contatore all'avvio con i dati appena recuperati dal localStorage
      this.contatoreSubject.next(this.articoli.length); 
    }
  }

  // --- METODI DI GESTIONE CARRELLO ---

  aggiungi(prodotto: any) {
    this.articoli.push(prodotto);
    this.salvaSuLocalStorage(); 
    this.contatoreSubject.next(this.articoli.length); // <-- Avvisa la Navbar
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
      this.contatoreSubject.next(this.articoli.length); // <-- Avvisa la Navbar
    }
  }

  // ---  METODI PER IL CHECKOUT ---

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