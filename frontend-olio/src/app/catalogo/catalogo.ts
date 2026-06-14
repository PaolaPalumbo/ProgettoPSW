import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // AGGIUNTO: Necessario per il form delle recensioni
import { CarrelloService } from '../carrello';
import { RecensioneService } from '../services/recensione.service'; // AGGIUNTO: Importa il nuovo servizio
import { Recensione } from '../models/recensione.model'; // AGGIUNTO: Importa il modello

// 1. Definisco la struttura del Prodotto (lo "specchio" della classe Java)
export interface Prodotto {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: number;
  formato: string;
  quantitaDisponibile: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule], // MODIFICATO: Aggiunto FormsModule
  templateUrl: './catalogo.html', 
  styleUrl: './catalogo.css'      
})
export class CatalogoComponent implements OnInit {
  // 2. Qui salvo l'olio in arrivo dal database
  prodotti: Prodotto[] = []; 

  // AGGIUNTO: Variabili per raccogliere l'input dell'utente dal form
  nuovoVoto: number = 5;
  nuovoCommento: string = '';
  // Dizionario per associare l'ID del prodotto alla sua lista di recensioni
  recensioniPerProdotto: { [idProdotto: number]: Recensione[] } = {};

  // MODIFICATO: Iniezione del nuovo RecensioneService nel costruttore
  constructor(
    private http: HttpClient, 
    private carrelloService: CarrelloService,
    private recensioneService: RecensioneService // AGGIUNTO
  ) {}

 // 3. Questo metodo scatta in automatico appena si apre la pagina
  ngOnInit(): void {
    this.http.get<Prodotto[]>('http://localhost:8080/api/prodotti')
      .subscribe({
        next: (dati) => {
          this.prodotti = dati;
          console.log("Prodotti caricati con successo dal Backend:", this.prodotti);
          
          // NUOVA RIGA: Per ogni prodotto caricato, chiediamo al backend le sue recensioni
          //this.prodotti.forEach(p => this.caricaRecensioni(p.id));
        },
        error: (errore) => {
          console.error("Errore di connessione a Spring Boot:", errore);
        }
      });
  }

  mettiNelCarrello(prodotto: Prodotto): void {
    this.carrelloService.aggiungi(prodotto);
    console.log('Prodotto aggiunto:', prodotto.nome);
  }

  // AGGIUNTO: Metodo che scatta quando l'utente clicca "Invia Recensione"
  inviaRecensione(prodottoCorrente: Prodotto) {
    const recensioneDaInviare: Recensione = {
      voto: Number(this.nuovoVoto),
      commento: this.nuovoCommento,
      utente: { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'test@test.com' },
      prodotto: prodottoCorrente
    };

    this.recensioneService.inviaRecensione(recensioneDaInviare).subscribe({
      next: (risposta) => {
        alert('Grazie! La tua recensione è stata inviata ed è in attesa di moderazione.');
        // Svuotiamo i campi per la prossima recensione
        this.nuovoCommento = ''; 
        this.nuovoVoto = 5;
      },
      error: (errore) => {
        console.error("C'è stato un problema durante l'invio:", errore);
        alert("Ops! Qualcosa è andato storto nell'invio della recensione.");
      }
    });
  }

// Metodo per recuperare le recensioni approvate
  caricaRecensioni(idProdotto: number) {
    this.recensioneService.getRecensioniProdotto(idProdotto).subscribe({
      next: (dati) => {
        // Salviamo le recensioni ricevute nel dizionario, usando l'ID come chiave
        this.recensioniPerProdotto[idProdotto] = dati;
      },
      error: (errore) => {
        console.error(`Errore nel caricamento recensioni per prodotto ${idProdotto}:`, errore);
      }
    });
  }

}