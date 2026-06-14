import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrelloService, CheckoutDTO } from '../carrello'; // <-- NOTA: aggiunto CheckoutDTO
import { Prodotto } from '../catalogo/catalogo';

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

  // --- LA NUOVA VERA FUNZIONALITÀ DI CHECKOUT ---
  procediAlCheckout(): void {
    // 1. Controllo di sicurezza
    if (this.elementiCarrello.length === 0) {
      alert('Il carrello è vuoto!');
      return;
    }

    // 2. Prendiamo il primo prodotto (per testare il flusso transazionale)
    const prodottoDaAcquistare = this.elementiCarrello[0];

    // 3. Assembliamo la "busta" DTO come descritto nel capitolo 6.5
    const payload: CheckoutDTO = {
      idUtente: 1, // Simuliamo l'utente 1 per il collaudo
      idProdotto: prodottoDaAcquistare.id,
      quantita: 1  // Impostiamo 1 latta di default per il test
    };

    // 4. Inoltriamo la richiesta al backend e ascoltiamo la risposta
    this.carrelloService.effettuaCheckout(payload).subscribe({
      next: (risposta) => {
        // Status 200 OK da Spring Boot
        alert('Acquisto completato con successo! Ordine registrato.');
        
        // State Reset: svuotiamo il Singleton e aggiorniamo la UI
        this.carrelloService.svuotaCarrello();
        this.aggiornaCarrello(); 
      },
      error: (errore) => {
        // Status 400 Bad Request (es. inventario esaurito)
        alert('Attenzione: ' + (errore.error || 'Errore durante la transazione'));
      }
    });
  }
}