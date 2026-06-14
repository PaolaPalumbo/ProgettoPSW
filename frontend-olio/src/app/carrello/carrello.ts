import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrelloService } from '../carrello'; // <- Punta al  file carrello.ts esterno
import { Prodotto } from '../catalogo/catalogo'; // <- Punta all'interfaccia nel catalogo

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css'
})
export class CarrelloComponent implements OnInit {
  elementiCarrello: Prodotto[] = [];
  totale: number = 0;

  constructor(private carrelloService: CarrelloService) {}

  ngOnInit(): void {
    this.aggiornaCarrello();
  }

  aggiornaCarrello(): void {
    this.elementiCarrello = this.carrelloService.getArticoli(); // Usa i nomi dei metodi che hai nel tuo service
    this.calcolaTotale();
  }

  calcolaTotale(): void {
    this.totale = this.elementiCarrello.reduce((somma, prodotto) => somma + prodotto.prezzo, 0);
  }

  rimuoviDalCarrello(prodotto: Prodotto): void {
    // 1. Diciamo al servizio di rimuoverlo dalla memoria
    this.carrelloService.rimuovi(prodotto); 
    
    // 2. Ricarichiamo la lista e ricalcoliamo il totale a schermo
    this.aggiornaCarrello(); 
  }

  procediAlCheckout(): void {
    alert('Funzionalità di Checkout in arrivo! Implementeremo le transazioni a breve.');
  }
}