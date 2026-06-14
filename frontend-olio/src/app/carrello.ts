import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Aggiunto per le chiamate di rete
import { Observable } from 'rxjs'; // Aggiunto per gestire l'asincronia

// Definiamo la "busta" DTO per comunicare con Spring Boot in modo sicuro
export interface CheckoutDTO {
  idUtente: number;
  idProdotto: number;
  quantita: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  private articoli: any[] = [];

  // Iniettiamo il client HTTP per abilitare le transazioni
  constructor(private http: HttpClient) { }

  aggiungi(prodotto: any) {
    this.articoli.push(prodotto);
    console.log('Latta aggiunta al carrello! Contenuto attuale:', this.articoli);
  }

  getArticoli() {
    return this.articoli;
  }

  getNumeroArticoli() {
    return this.articoli.length;
  }

  rimuovi(prodotto: any) {
    // Cerchiamo l'indice del prodotto all'interno dell'array
    const index = this.articoli.findIndex(a => a.id === prodotto.id);
    if (index > -1) {
      // Se lo troviamo, lo rimuoviamo (1 elemento a partire da quell'indice)
      this.articoli.splice(index, 1);
    }
  }

  // --- NUOVI METODI PER IL CHECKOUT REALE ---

  // Metodo per resettare lo stato dopo l'acquisto
  svuotaCarrello(): void {
    this.articoli = [];
  }

  // Metodo che spedisce materialmente i dati a Spring Boot
  effettuaCheckout(checkoutData: CheckoutDTO): Observable<any> {
    return this.http.post('http://localhost:8080/api/ordini/checkout', checkoutData);
  }
}