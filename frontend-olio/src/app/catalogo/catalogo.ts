import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // AGGIUNTO: Necessario per il form delle recensioni
import { Router, NavigationEnd } from '@angular/router'; // AGGIUNTO: Per gestire la navigazione
import { filter } from 'rxjs/operators'; // AGGIUNTO: Per filtrare gli eventi del router
import { CarrelloService } from '../services/carrello.service';
import { RecensioneService } from '../services/recensione.service'; // AGGIUNTO: Importa il nuovo servizio
import { CatalogoService } from '../services/catalogo.service'; // AGGIUNTO: Importa il CatalogoService
import { Recensione } from '../models/recensione.model'; // AGGIUNTO: Importa il modello
import { ChangeDetectorRef } from '@angular/core';//gestione operazioni asincrone lato frontend--->BehaviouralSubject nel backend

// 1. Definisco la struttura del Prodotto (lo "specchio" della classe Java)--->DTO
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
  imports: [CommonModule, FormsModule], 
  templateUrl: './catalogo.html', 
  styleUrl: './catalogo.css'       
})
export class CatalogoComponent implements OnInit {
  // 2. Qui salvo l'olio in arrivo dal database
  prodotti: Prodotto[] = []; 

  // AGGIUNTO: Variabili per i filtri di ricerca
  searchTerm: string = '';
  filtroFormato: string = '';
  filtroPrezzo: number = 0;
  
  // Aggiunta per gestire l'eliminazione
  emailCorrente: string = 'test@test.com'; // In un'app reale, la recuperi dal Token/AuthService

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
    private recensioneService: RecensioneService,
    private catalogoService: CatalogoService, //  Inietto il servizio del catalogo
    private cdRef: ChangeDetectorRef, 
    private router: Router // Iniettato per ascoltare il cambio rotta
  ) {
    //  Questo ascolta ogni volta che la navigazione finisce e aggiorna i dati
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.aggiornaTutto();
    });
  }

  // Getter ottimizzato con pulizia stringhe per evitare errori di match
  get prodottiFiltrati(): Prodotto[] {
    return this.prodotti.filter(p => {
      // 1. Ricerca testuale
      const matchNome = p.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // 2. Filtro Formato: ELASTICO
      // Se selezioni '3L', questo trova 'Latta 3L', 'Bottiglia 3L', '3L' ecc.
      const matchFormato = this.filtroFormato 
        ? p.formato.toLowerCase().includes(this.filtroFormato.toLowerCase()) 
        : true;

      // 3. Filtro Prezzo (MODIFICATO: ora è prezzo massimo)
      const matchPrezzo = this.filtroPrezzo > 0 ? p.prezzo <= this.filtroPrezzo : true;
      
      return matchNome && matchFormato && matchPrezzo;
    });
  }

  //Genera automaticamente i formati unici dal DB per il menu a tendina
  get formatiUnici(): string[] {
    return [...new Set(this.prodotti.map(p => p.formato))].sort();
  }

  //INVOCAZIONE DELL'API REST
  // 3. Questo metodo scatta in automatico appena si apre la pagina
  ngOnInit(): void {
    // Inizializzazione esplicita: resettiamo gli array-dizionari per evitare conflitti tra rotte:
    //In questo modo sei sicura che l'utente vedrà solo ed esclusivamente i dati freschi 
    // appena scaricati dal server, offrendo un'esperienza fluida e senza "sfarfallii" 
    // di vecchi contenuti.-->AGGIORNO I DATI PER VEDERE SEMPRE QUELLI ATTUALI
    this.prodotti = [];
    this.recensioniPerProdotto = {};
    this.nuoveRecensioni = {};

    //PERCHE I DIZIONARI? In questo modo associo l’ID univoco di ogni prodotto 
    // alla sua specifica lista di recensioni o allo stato del form di inserimento

    // Uso il CatalogoService invece di this.http.get diretto
    //CARICO I DATI
    this.catalogoService.getProdotti()
      .subscribe({
        next: (dati) => {
          this.prodotti = dati;
          console.log("Prodotti caricati con successo dal Backend:", this.prodotti);
          
          // FORZO ANGULAR A RIFARSI IL TRUCCO:AGGIORNA IMMEDIATAMENTE L'INTERFACCIA HTML
          this.cdRef.detectChanges();
          //Per ogni prodotto caricato, chiediamo al backend le sue recensioni
          this.prodotti.forEach(p => this.caricaRecensioni(p.id));
        },
        error: (errore) => {
          console.error("Errore di connessione a Spring Boot:", errore);
        }
      });
  }
  //AGGIUNTA AL CARRELLO
  mettiNelCarrello(prodotto: Prodotto): void {
    this.carrelloService.aggiungi(prodotto);
    console.log('Prodotto aggiunto:', prodotto.nome);
  }

  // ----METODI PER LA GESTIONE DEL FORM VISIVO ---
  
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
    const recensioneDaInviare: Recensione = {//contruisco la recensione
      // estraggo i dati dal dizionario usando l'ID del prodotto
      voto: Number(this.nuoveRecensioni[prodottoCorrente.id].voto),
      commento: this.nuoveRecensioni[prodottoCorrente.id].commento,
      utente: { id: 1, nome: 'User', cognome: '', email: 'test@test.com' },
      prodotto: prodottoCorrente
    };

    this.recensioneService.inviaRecensione(recensioneDaInviare).subscribe({//la invio al backend
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

  // Metodo per eliminare una recensione
  eliminaRecensione(idRecensione: number) {
    if (confirm("Sei sicuro di voler eliminare questa recensione?")) {
      this.recensioneService.eliminaRecensione(idRecensione).subscribe({
        next: () => {
          alert("Recensione eliminata.");
          this.aggiornaTutto();
        },
        error: (err) => alert("Errore durante l'eliminazione.")
      });
    }
  }

  // Metodo per recuperare le recensioni approvate
  caricaRecensioni(idProdotto: number) {
    // Inizializzo sempre come array vuoto per evitare "undefined"
    if (!this.recensioniPerProdotto[idProdotto]) {
        this.recensioniPerProdotto[idProdotto] = [];
    }
    
    this.recensioneService.getRecensioniProdotto(idProdotto).subscribe({
      next: (dati) => {
        this.recensioniPerProdotto[idProdotto] = dati; //arrivano i dati
        this.cdRef.detectChanges();//forzo l'HTML ad aggiornarsi
      },
      error: (errore) => {
        console.error(`Errore recensioni per ${idProdotto}:`, errore);
        this.recensioniPerProdotto[idProdotto] = [];
        this.cdRef.detectChanges();
      }
    });
  }

  ionViewWillEnter() {
    this.aggiornaTutto();
  }

  aggiornaTutto() {
    this.catalogoService.getProdotti().subscribe(dati => { //chiedo al backend il catalogo
      this.prodotti = dati; //il server mi ha mandato i dati e li salvo nella variabile
      this.prodotti.forEach(p => this.caricaRecensioni(p.id));
      //per ogni prodotto carico le recensioni
    });
  }
}