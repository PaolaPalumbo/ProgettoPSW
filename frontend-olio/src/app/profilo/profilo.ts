import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UtenteService } from '../services/utente.service';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profilo.html',
  styleUrls: ['./profilo.css']
})
export class ProfiloComponent implements OnInit {
  // Array che contengono i miei dati
  ordini: any[] = [];
  recensioni: any[] = [];
  
  // Variabili per gestire i miei stati dell'interfaccia
  caricamento: boolean = true;
  messaggioErrore: string = '';

  // Variabile per capire quale pulsante o voce del menu ho cliccato
  sezioneAttiva: 'ordini' | 'recensioni' = 'ordini';

  private apiUrlOrdini = 'http://localhost:8080/api/ordini/miei'; 
  private apiUrlRecensioni = 'http://localhost:8080/api/recensioni/miei'; 

  constructor(
    private http: HttpClient,
    private utenteService: UtenteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Inietto il ChangeDetector per forzare l'aggiornamento
  ) {}

  ngOnInit() {
    // PROTEZIONE: Se non sono loggata, mi reindirizzo al login
    if (!this.utenteService.isLoggedIn()) {
      console.log('Accesso negato: devo prima fare il login.');
      this.router.navigate(['/login']);
      return;
    }

    // MI METTO IN ASCOLTO: Leggo il parametro dall'URL ogni volta che cambio tab
    this.route.queryParams.subscribe(params => {
      // Imposto la sezione attiva in base al parametro
      this.sezioneAttiva = params['tab'] === 'recensioni' ? 'recensioni' : 'ordini';
      
      // Quando cambio tab, imposto il caricamento a true e forzo l'aggiornamento
      this.caricamento = true; 
      this.cdr.detectChanges(); 
      
      if (this.sezioneAttiva === 'ordini') {
        this.caricaOrdini();
      } else {
        this.caricaRecensioni();
      }
    });
  }

  // Metodo per cambiare la vista quando clicco sui pulsanti
  cambiaSezione(sezione: 'ordini' | 'recensioni') {
    this.sezioneAttiva = sezione;
  }

  caricaOrdini() {
    // Resetto gli errori precedenti
    this.messaggioErrore = ''; 
    
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
    // Resetto gli errori precedenti
    this.messaggioErrore = ''; 
    
    // Faccio la chiamata HTTP per recuperare le mie recensioni
    this.http.get<any[]>(this.apiUrlRecensioni).subscribe({
      next: (data) => {
        console.log('Ho ricevuto le mie recensioni:', data);
        this.recensioni = data;
        this.caricamento = false; // Fermo lo spinner
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      },
      error: (err) => {
        console.error('Errore durante il recupero recensioni:', err);
        this.messaggioErrore = 'Non è stato possibile caricare le mie recensioni.';
        this.caricamento = false; // Fermo lo spinner anche in caso di errore
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      }
    });
  }
}