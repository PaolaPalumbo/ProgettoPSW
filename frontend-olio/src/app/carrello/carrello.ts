import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; //  Necessario per far funzionare i link di navigazione
import { CarrelloService } from '../services/carrello.service';
import { Prodotto } from '../catalogo/catalogo';

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink
  templateUrl: './carrello.html',
  styleUrl: './carrello.css'
})
export class CarrelloComponent implements OnInit {
  elementiCarrello: Prodotto[] = [];
  totale: number = 0;

  // Aggiunto Router nel costruttore per permettere la navigazione
  constructor(private carrelloService: CarrelloService, private router: Router) {}

  ngOnInit(): void {
    this.aggiornaCarrello();
  }

  aggiornaCarrello(): void {
    this.elementiCarrello = this.carrelloService.getArticoli(); 
    this.calcolaTotale();
  }

  calcolaTotale(): void {
    this.totale = this.elementiCarrello.reduce((somma, prodotto) => somma + prodotto.prezzo, 0);
  }

  rimuoviDalCarrello(prodotto: Prodotto): void {
    this.carrelloService.rimuovi(prodotto); 
    this.aggiornaCarrello(); 
  }

  // --- LA MIA NUOVA VERA FUNZIONALITÀ DI CHECKOUT ---
  procediAlCheckout(): void {
    // 1. Controllo di sicurezza
    if (!this.elementiCarrello || this.elementiCarrello.length === 0) {
      alert('Il mio carrello è vuoto!');
      return;
    }

    // 2. Navigo verso la pagina di checkout invece di inviare subito l'ordine
    // Questo permette all'utente di compilare i dati di spedizione nel CheckoutComponent
    this.router.navigate(['/checkout']);
  }
}