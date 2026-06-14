import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  private articoli: any[] = [];

  constructor() { }

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
}