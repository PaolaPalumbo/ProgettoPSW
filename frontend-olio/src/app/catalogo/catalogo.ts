import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // AGGIUNTO: Necessario per il form delle recensioni
import { Router, NavigationEnd } from '@angular/router'; // AGGIUNTO: Per gestire la navigazione
import { filter } from 'rxjs/operators'; // AGGIUNTO: Per filtrare gli eventi del router
import { CarrelloService } from '../carrello';
import { RecensioneService } from '../services/recensione.service'; // AGGIUNTO: Importa il nuovo servizio
import { Recensione } from '../models/recensione.model'; // AGGIUNTO: Importa il modello
import { ChangeDetectorRef } from '@angular/core';

// 1. Definisco la struttura del Prodotto (lo "specchio" della classe Java)
export interface Prodotto {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: number;
  formato: string;
  quantitaDisponibile: number;
  immagineUrl: string;
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
  nuoveRecensioni: { [id: number]: { voto: number, commento: string } } = {};
  
  // MODIFICATO: Iniezione del nuovo RecensioneService nel costruttore
  constructor(
    private http: HttpClient, 
    private carrelloService: CarrelloService,
    private recensioneService: RecensioneService, // AGGIUNTO
    private cdRef: ChangeDetectorRef, // AGGIUNTO
    private router: Router // AGGIUNTO: Iniettato per ascoltare il cambio rotta
  ) {
    // AGGIUNTO: Questo ascolta ogni volta che la navigazione finisce e aggiorna i dati
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.aggiornaTutto();
    });
  }

  // 3. Questo metodo scatta in automatico appena si apre la pagina
  ngOnInit(): void {
    // Inizializzazione esplicita: resettiamo gli array per evitare conflitti tra rotte
    this.prodotti = [];
    this.recensioniPerProdotto = {};
    this.nuoveRecensioni = {};

    this.http.get<Prodotto[]>('http://localhost:8080/api/prodotti')
      .subscribe({
        next: (dati) => {
          this.prodotti = dati;
          console.log("Prodotti caricati con successo dal Backend:", this.prodotti);
          
          // FORZO ANGULAR A RIFARSI IL TRUCCO
          this.cdRef.detectChanges();
          //Per ogni prodotto caricato, chiediamo al backend le sue recensioni
          this.prodotti.forEach(p => this.caricaRecensioni(p.id));
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

  // --- NUOVI METODI PER LA GESTIONE DEL FORM VISIVO ---
  
  // Mostra il modulo di recensione per un prodotto specifico
  apriFormRecensione(idProdotto: number) {
    this.nuoveRecensioni[idProdotto] = { voto: 5, commento: '' };
  }

  // Nasconde il modulo se l'utente annulla l'operazione
  chiudiFormRecensione(idProdotto: number) {
    delete this.nuoveRecensioni[idProdotto];
  }

  // AGGIUNTO: Metodo che scatta quando l'utente clicca "Invia Recensione"
  inviaRecensione(prodottoCorrente: Prodotto) {
    const recensioneDaInviare: Recensione = {
      // MODIFICA APPLICATA QUI: estraggo i dati dal dizionario usando l'ID del prodotto
      voto: Number(this.nuoveRecensioni[prodottoCorrente.id].voto),
      commento: this.nuoveRecensioni[prodottoCorrente.id].commento,
      utente: { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'test@test.com' },
      prodotto: prodottoCorrente
    };

    this.recensioneService.inviaRecensione(recensioneDaInviare).subscribe({
      next: (risposta) => {
        alert('Grazie! La tua recensione è stata inviata ed è in attesa di moderazione.');
        // Chiude il form in automatico dopo l'invio corretto
        delete this.nuoveRecensioni[prodottoCorrente.id];
      },
      error: (errore) => {
        console.error("C'è stato un problema durante l'invio:", errore);
        alert("Ops! Qualcosa è andato storto nell'invio della recensione.");
      }
    });
  }

  // Metodo per recuperare le recensioni approvate
  caricaRecensioni(idProdotto: number) {
    // Inizializzo sempre come array vuoto per evitare "undefined"
    if (!this.recensioniPerProdotto[idProdotto]) {
        this.recensioniPerProdotto[idProdotto] = [];
    }
    
    this.recensioneService.getRecensioniProdotto(idProdotto).subscribe({
      next: (dati) => {
        this.recensioniPerProdotto[idProdotto] = dati;
      },
      error: (errore) => {
        console.error(`Errore recensioni per ${idProdotto}:`, errore);
        // Anche in caso di errore, garantisco che sia un array vuoto
        this.recensioniPerProdotto[idProdotto] = [];
      }
    });
  }

  // Quando il sistema mi avvisa che l'utente sta tornando su questa pagina,
  // colgo l'occasione per ricaricare tutti i dati e assicurarmi che siano freschi.
  ionViewWillEnter() {
    this.aggiornaTutto();
  }

  // Qui prendo in mano la situazione: contatto direttamente il backend per avere 
  // la lista aggiornata di tutti i prodotti. Appena mi rispondono, sovrascrivo la mia 
  // vecchia lista di prodotti con quella nuova e, per ognuno di essi, chiedo 
  // nuovamente al server le recensioni (incluse quelle appena approvate nel pannello admin).
  aggiornaTutto() {
    this.http.get<Prodotto[]>('http://localhost:8080/api/prodotti').subscribe(dati => {
      this.prodotti = dati;
      // Per ogni prodotto, rigenero la richiesta delle recensioni per mostrare 
      // i cambiamenti avvenuti nel frattempo
      this.prodotti.forEach(p => this.caricaRecensioni(p.id));
    });
  }
}