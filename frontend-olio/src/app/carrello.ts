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
}