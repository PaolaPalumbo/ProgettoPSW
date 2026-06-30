import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // AGGIUNTO: Import per la gestione del Form degli indirizzi
import { UtenteService } from '../services/utente.service';
import { RecensioneService } from '../services/recensione.service'; // AGGIUNTO: Import del servizio recensioni
import { CarrelloService } from '../services/carrello.service'; // <-- AGGIUNTO: Import del servizio carrello per la cancellazione
import { IndirizzoSpedizione } from '../models/indirizzo.spedizione';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], // AGGIUNTO: Inclusione dei moduli per i form reattivi
  templateUrl: './profilo.html',
  styleUrls: ['./profilo.css']
})
export class ProfiloComponent implements OnInit {
  // Array che contengono i miei dati
  ordini: any[] = [];
  recensioni: any[] = [];
 listaIndirizzi: any[] = []; // AGGIUNTO: Array per mappare la lista degli indirizzi caricati dal database
  
  // Variabili per gestire i miei stati dell'interfaccia
  caricamento: boolean = false; // Modificato a false di default per prevenire blocchi visivi all'inizializzazione della pagina
  messaggioErrore: string = '';

  // Variabili per la gestione del salvataggio del nuovo indirizzo
  indirizzoForm!: FormGroup; // AGGIUNTO
  messaggioSuccessoIndirizzo: string = ''; // AGGIUNTO
  messaggioErroreIndirizzo: string = ''; // AGGIUNTO

  // Variabile per capire quale pulsante o voce del menu ho cliccato (estesa con 'indirizzi')
  sezioneAttiva: 'ordini' | 'recensioni' | 'indirizzi' = 'ordini';

  private apiUrlOrdini = 'http://localhost:8080/api/ordini/miei'; 
  private apiUrlRecensioni = 'http://localhost:8080/api/recensioni/miei'; 

  constructor(
    private http: HttpClient,
    private utenteService: UtenteService,
    private recensioneService: RecensioneService, // AGGIUNTO
    private carrelloService: CarrelloService, // <-- AGGIUNTO: Iniezione del CarrelloService
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder, // AGGIUNTO: Iniezione del FormBuilder per costruire il form dell'indirizzo
    private cdr: ChangeDetectorRef // Inietto il ChangeDetector per forzare l'aggiornamento
  ) {}

  ngOnInit() {
    // PROTEZIONE: Se non sono loggata, mi reindirizzo al login
    if (!this.utenteService.isLoggedIn()) {
      console.log('Accesso negato: devo prima fare il login.');
      this.router.navigate(['/login']);
      return;
    }

    // Inizializzazione del form reattivo per l'inserimento dell'indirizzo con validazioni dedicate
    this.indirizzoForm = this.fb.group({
      nomeIndirizzo: ['', [Validators.required, Validators.minLength(3)]],
      indirizzoSpedizione: ['', [Validators.required]],
      citta: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });

    // MI METTO IN ASCOLTO: Leggo il parametro dall'URL ogni volta che cambio tab
    this.route.queryParams.subscribe(params => {
      // Imposto la sezione attiva in base al parametro
      if (params['tab'] === 'recensioni') {
        this.sezioneAttiva = 'recensioni';
      } else if (params['tab'] === 'indirizzi') {
        this.sezioneAttiva = 'indirizzi';
      } else {
        this.sezioneAttiva = 'ordini';
      }
      
      // Quando cambio tab, eseguiamo le chiamate con un microscopico ritardo asincrono per dare tempo al template di aggiornarsi
      setTimeout(() => {
        if (this.sezioneAttiva === 'ordini') {
          this.caricaOrdini();
        } else if (this.sezioneAttiva === 'recensioni') {
          this.caricaRecensioni();
        } else if (this.sezioneAttiva === 'indirizzi') {
          this.caricaIndirizzi();
        } else {
          this.cdr.detectChanges();
        }
      }, 0);
    });
  }

  // Metodo per cambiare la vista quando clicco sui pulsanti
  cambiaSezione(sezione: 'ordini' | 'recensioni' | 'indirizzi') {
    this.sezioneAttiva = sezione;
  }

  caricaOrdini() {
    // Resetto gli errori precedenti e avvio lo spinner
    this.messaggioErrore = ''; 
    this.caricamento = true;
    this.cdr.detectChanges();
    
    // Faccio la chiamata HTTP per recuperare i miei ordini
    this.http.get<any[]>(this.apiUrlOrdini).subscribe({
      next: (data) => {
        console.log('Ho ricevuto i miei ordini:', data);
        this.ordini = data;
        this.caricamento = false; // Fermo lo spinner
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      },
      error: (err) => {
        console.error('Errore durante il recupero ordini:', err);
        this.messaggioErrore = 'Non è stato possibile caricare i miei ordini.';
        this.caricamento = false; // Fermo lo spinner anche in caso di errore
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      }
    });
  }

  caricaRecensioni() {
    // Resetto gli errori precedenti e avvio lo spinner
    this.messaggioErrore = ''; 
    this.caricamento = true;
    this.cdr.detectChanges();
    
    // USO IL SERVIZIO INVECE DELL'HTTP DIRETTO, così è coerente con l'eliminazione
    this.http.get<any[]>(this.apiUrlRecensioni).subscribe({
      next: (data) => {
        console.log('Dati ricevuti dal backend:', data); 
        this.recensioni = data;
        this.caricamento = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Errore durante il recupero recensioni:', err);
        this.messaggioErrore = 'Non è stato possibile caricare le mie recensioni.';
        this.caricamento = false; 
        this.cdr.detectChanges(); 
      }
    });
  }

  // Metodo per caricare la rubrica degli indirizzi salvati dell'utente corrente
  caricaIndirizzi() {
    this.messaggioErrore = '';
    this.caricamento = true;
    this.cdr.detectChanges();

    const utenteLoggato = localStorage.getItem('utente');
    if (utenteLoggato) {
      const utenteId = JSON.parse(utenteLoggato).id;
      if (utenteId) {
        this.utenteService.getIndirizziUtente(utenteId).subscribe({
          next: (data) => {
            this.listaIndirizzi = data;
            this.caricamento = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Errore recupero indirizzi:', err);
            this.messaggioErrore = 'Non è stato possibile caricare la tua rubrica indirizzi.';
            this.caricamento = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.caricamento = false;
        this.cdr.detectChanges();
      }
    } else {
      this.caricamento = false;
      this.cdr.detectChanges();
    }
  }
  
  // Metodo per eliminare una recensione
  eliminaRecensione(idRecensione: number) {
    if (confirm("Sei sicuro di voler eliminare questa recensione?")) {
      this.recensioneService.eliminaRecensione(idRecensione).subscribe({
        next: () => {
          alert("Recensione eliminata.");
          this.caricaRecensioni(); // Ricarico la lista delle recensioni
        },
        error: (err) => alert("Errore durante l'eliminazione.")
      });
    }
  }

  // Metodo per salvare il nuovo indirizzo di spedizione
  salvaNuovoIndirizzo() {
    if (this.indirizzoForm.valid) {
      // Recupero i dati dell'utente dal localStorage per estrarre l'ID
      const utenteLoggato = localStorage.getItem('utente');
      if (!utenteLoggato) {
        this.messaggioErroreIndirizzo = "Sessione utente non valida. Effettua nuovamente il login.";
        return;
      }
      
      const utenteId = JSON.parse(utenteLoggato).id;
      const nuovoIndirizzo: IndirizzoSpedizione = this.indirizzoForm.value;

      this.utenteService.aggiungiIndirizzoUtente(utenteId, nuovoIndirizzo).subscribe({
        next: (risposta) => {
          this.messaggioSuccessoIndirizzo = "Indirizzo salvato con successo nella tua rubrica!";
          this.messaggioErroreIndirizzo = '';
          this.indirizzoForm.reset(); // Svuoto il form dopo il salvataggio
          this.caricaIndirizzi(); // Ricarico la rubrica per mostrare immediatamente l'indirizzo appena salvato
        },
        error: (err) => {
          console.error("Errore salvataggio indirizzo:", err);
          this.messaggioErroreIndirizzo = "Impossibile salvare l'indirizzo. Controlla i dati o riprova.";
          this.messaggioSuccessoIndirizzo = '';
          this.cdr.detectChanges();
        }
      });
    }
  }

  // --- Eliminazione account ---
  onEliminaAccount(): void {
    // Mostro un messaggio di conferma per evitare click accidentali
    const conferma = confirm("Sei assolutamente sicuro di voler eliminare il tuo account? L'operazione è irreversibile e perderai la cronologia dei tuoi ordini.");
    
    if (conferma) {
      this.utenteService.eliminaAccount().subscribe({
        next: (risposta) => {
          console.log(risposta.message);
          
          // 1. Svuota la sessione di autenticazione locale
          this.utenteService.logout(); 
          
          // 2. Svuota il carrello e pulisci il localStorage
          this.carrelloService.svuotaCarrello(); 
          
          // 3. Reindirizza l'utente alla Home del sito
          this.router.navigate(['/']);
          
          alert("Il tuo account è stato eliminato definitivamente.");
        },
        error: (errore) => {
          console.error("Errore durante l'eliminazione dell'account", errore);
          alert("Si è verificato un errore. Impossibile eliminare l'account al momento.");
        }
      });
    }
  }

  // Metodo per eliminare un indirizzo di spedizione dalla rubrica
 eliminaIndirizzo(idIndirizzo: number) {
    if (confirm("Sei sicuro di voler eliminare questo indirizzo dalla tua rubrica?")) {
      // URL pulito con un solo "utenti"
      const urlDelete = `http://localhost:8080/api/utenti/indirizzi/${idIndirizzo}`;
      
      this.http.delete(urlDelete).subscribe({
        next: () => {
          alert("Indirizzo eliminato con successo.");
          this.caricaIndirizzi(); 
        },
        error: (err) => {
          console.error("Errore durante l'eliminazione dell'indirizzo:", err);
        }
      });
    }
  }
}