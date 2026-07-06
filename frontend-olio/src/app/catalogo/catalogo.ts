import { Component, OnInit } from '@angular/core';//Angular capisce di aver a che fare con un componente, ossia
//un'interfaccia visiva legata ad un file HTML e ad uno CSS.

import { CommonModule } from '@angular/common';//STANDALONE COMPONENT
import { HttpClient } from '@angular/common/http';// per la comunicazione con il backend-> chiamate http (get, post, put...)
import { FormsModule } from '@angular/forms'; // Necessario per il form delle recensioni STANDALONE COMPONENT
import { Router, NavigationEnd } from '@angular/router'; // Per gestire la navigazione tra le pagine e ascoltare eventuli "eventi" di navigazione
import { filter } from 'rxjs/operators'; // Per filtrare gli eventi del router e rimanere in ascolto sull'Observable degli eventi di navigazione
import { CarrelloService } from '../services/carrello.service';
import { RecensioneService } from '../services/recensione.service'; // Importa il nuovo servizio
import { CatalogoService } from '../services/catalogo.service'; //Importa il CatalogoService
import { Recensione } from '../models/recensione.model'; //  Importa il modello
import { ChangeDetectorRef } from '@angular/core';//gestione operazioni asincrone lato frontend-->BehaviouralSubject 
//per la gestione di stati globali condivisi tra componenti diversi, come il carrello o l'autenticazione dell'utente.

// 1. Definisco la struttura del Prodotto (lo "specchio" della classe Java)--->DTO
//type safety
export interface Prodotto { //"export interface" definisce la struttura che un oggetto deve avere
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
export class CatalogoComponent implements OnInit {//"export class" definisce la struttura dei dati ma contiene anche la logica del componente
  //OnInit è un'interfaccia che indica che il componente ha un metodo ngOnInit() che viene chiamato automaticamente da Angular quando 
  // il componente viene inizializzato.


  // 2. Qui salvo l'olio in arrivo dal database
  prodotti: Prodotto[] = []; 

  // Variabili per i filtri di ricerca
  searchTerm: string = '';
  filtroFormato: string = '';
  filtroPrezzo: number = 0;
  
  //per gestire l'eliminazione
  emailCorrente: string = 'test@test.com'; // In un'app reale, la recuperi dal Token/AuthService

  // Variabili per raccogliere l'input dell'utente dal form
  nuovoVoto: number = 5;
  nuovoCommento: string = '';
  // Dizionario per associare l'ID del prodotto alla sua lista di recensioni
  recensioniPerProdotto: { [idProdotto: number]: Recensione[] } = {};
  nuoveRecensioni: { [id: number]: { voto: number, commento: string } } = {};
  
  // Iniezione del nuovo RecensioneService nel costruttore
  constructor(//Dependency Injection---->"contructor" mi serve per iniettare le dipendenze necessarie al componente
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
    return this.prodotti.filter(p => { //prendo un array completo di prodotti "this.prodotti" e lo filtro in base ai criteri di ricerca
      // 1. Ricerca testuale
      const matchNome = p.nome.toLowerCase().includes(this.searchTerm.toLowerCase());//confronta il nome del prodotto con la parola cercata dall'utente
      
      // 2. Filtro Formato: ELASTICO
      // Se seleziono '3L', questo trova 'Latta 3L', 'Bottiglia 3L', '3L' ecc.
      const matchFormato = this.filtroFormato 
        ? p.formato.toLowerCase().includes(this.filtroFormato.toLowerCase()) 
        : true;

      // 3. Filtro Prezzo 
      const matchPrezzo = this.filtroPrezzo > 0 ? p.prezzo <= this.filtroPrezzo : true;
      
      return matchNome && matchFormato && matchPrezzo;
    });
  }

  //Genera automaticamente i formati unici dal DB per il menu a tendina:
  //se voglio aggiungere nuovi formati nei DB, Angular si aggiornerà automaticamente
  //senza modificare il codice:
  /*Legge dinamicamente l'array dei prodotti che è appena arrivato dal backend e 
  deduce i formati disponibili in quel preciso istante.*/
  get formatiUnici(): string[] {
    return [...new Set(this.prodotti.map(p => p.formato))].sort();
  }

  //INVOCAZIONE DELL'API REST
  // 3. Questo metodo scatta in automatico appena si apre la pagina--->implemento la logica del componente
  ngOnInit(): void {
    // Inizializzazione esplicita: resetto gli array/dizionari per evitare conflitti tra rotte:
    //In questo modo sono sicura che l'utente vedrà solo ed esclusivamente i dati freschi 
    // appena scaricati dal server, offrendo un'esperienza fluida e senza "sfarfallii" 
    // di vecchi contenuti  -->AGGIORNO I DATI PER VEDERE SEMPRE QUELLI ATTUALI
    this.prodotti = [];
    this.recensioniPerProdotto = {};//dizionario-->associo l'ID univoco di ogni prodotto alla propria recensione
    this.nuoveRecensioni = {};

    //PERCHE I DIZIONARI? In questo modo associo l’ID univoco di ogni prodotto 
    // alla sua specifica lista di recensioni o allo stato del form di inserimento


    
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

  // Metodo che scatta quando l'utente clicca "Invia Recensione"
  inviaRecensione(prodottoCorrente: Prodotto) {
    const recensioneDaInviare: Recensione = {//contruisco la recensione
      // estraggo i dati dal dizionario usando l'ID del prodotto
      voto: Number(this.nuoveRecensioni[prodottoCorrente.id].voto),
      commento: this.nuoveRecensioni[prodottoCorrente.id].commento,
      utente: { id: 1, nome: 'User', cognome: '', email: 'test@test.com' },
      prodotto: prodottoCorrente
    };

    this.recensioneService.inviaRecensione(recensioneDaInviare).subscribe({//la invio al backend e mi iscrivo a Obsarvable per "rimanere al passo"
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
      this.recensioneService.eliminaRecensione(idRecensione).subscribe({//il componente si iscrive all'Observable per rimanere aggiornato sullo stato della chiamata
        next: () => {
          alert("Recensione eliminata.");
          this.aggiornaTutto();
        },
        error: (err) => alert("Errore durante l'eliminazione.")
      });
    }
  }

  // Metodo per recuperare le recensioni per prodotto
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

  //garantisce che i dati mostrati a schermo siano sempre aggiornati all'ultimo secondo,
  //forzando un refresh a ogni singola visualizzazione della pagina.
  //praticamente, spolvera la vetrina ogni volta che viene caricata la pagina
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