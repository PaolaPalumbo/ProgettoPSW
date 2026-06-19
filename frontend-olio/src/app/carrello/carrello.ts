import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; //  Necessario per far funzionare i link di navigazione
import { CarrelloService, CheckoutDTO } from '../carrello'; // <-- NOTA: aggiunto CheckoutDTO
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

  // --- LA MIA NUOVA VERA FUNZIONALITÀ DI CHECKOUT ---
  procediAlCheckout(): void {
    // 1. Controllo di sicurezza
    if (this.elementiCarrello.length === 0) {
      alert('Il mio carrello è vuoto!');
      return;
    }

    // 2. Assemblo la "busta" DTO come descritto nella mia relazione
    // Utilizzo map() per processare TUTTI gli articoli presenti nel carrello
    const payload: CheckoutDTO[] = this.elementiCarrello.map(prodotto => ({
      // L'idUtente andrà tolto quando il mio backend lo estrarrà in automatico dal JWT
      idUtente: 1, // Simulo l'utente 1 per il collaudo attuale
      idProdotto: prodotto.id,
      quantita: 1  // Imposto 1 latta di default per il test
    }));

    // 3. Inoltro la richiesta al backend e ascolto la risposta asincrona
    this.carrelloService.effettuaCheckout(payload).subscribe({
      next: (risposta) => {
        // Status 200 OK da Spring Boot
        alert('Acquisto completato con successo! Il mio ordine è stato registrato.');
        
        // 4. State Reset: svuoto il mio Singleton e aggiorno istantaneamente la UI
        this.carrelloService.svuotaCarrello();
        this.aggiornaCarrello(); 
      },
      error: (errore) => {
        // Status 400 Bad Request (es. inventario esaurito o errore server)
        alert('Attenzione: ' + (errore.error?.message || errore.error || 'Errore durante la transazione'));
      }
    });
  }
}