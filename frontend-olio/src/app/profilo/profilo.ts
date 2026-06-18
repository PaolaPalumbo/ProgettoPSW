import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Aggiunto Router per il reindirizzamento
import { UtenteService } from '../services/utente.service'; // Importo il mio servizio per il controllo login

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profilo.html',
  styleUrls: ['./profilo.css']
})
export class ProfiloComponent implements OnInit {
  // Array che conterranno i miei dati
  ordini: any[] = [];
  recensioni: any[] = []; // Aggiunto per gestire la sezione "Le Mie Recensioni" dell'HTML
  
  // Variabili per gestire gli stati dell'interfaccia
  caricamento: boolean = true;
  messaggioErrore: string = '';

  // VARIABILE NUOVA: Mi serve per capire quale pulsante è stato cliccato nell'HTML. 
  // Di default mostro la cronologia ordini.
  sezioneAttiva: 'ordini' | 'recensioni' = 'ordini';

  // L'URL che punta al mio controller Spring Boot
  private apiUrl = 'http://localhost:8080/api/ordini/miei'; 

  // Inietto i servizi di cui ho bisogno
  constructor(
    private http: HttpClient,
    private utenteService: UtenteService,
    private router: Router
  ) {}

  ngOnInit() {
    // PROTEZIONE: Se non sono loggata, mi reindirizzo automaticamente al login
    if (!this.utenteService.isLoggedIn()) {
      console.log('Accesso negato: devo prima fare il login.');
      this.router.navigate(['/login']);
      return;
    }

    // Se sono autorizzata, avvio il recupero dei miei dati
    this.caricaOrdini();
    this.caricaRecensioni();
  }

  // METODO NUOVO: Cambia la vista dell'interfaccia quando clicco sui pulsanti
  cambiaSezione(sezione: 'ordini' | 'recensioni') {
    this.sezioneAttiva = sezione;
  }

  caricaOrdini() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.ordini = data;
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore durante il recupero ordini:', err);
        this.messaggioErrore = 'Non è stato possibile caricare i miei ordini. Riprova più tardi.';
        this.caricamento = false;
      }
    });
  }

  caricaRecensioni() {
    // TODO: In futuro inserirò qui la chiamata HTTP per recuperare le mie recensioni
    console.log('Predisposizione per il caricamento delle mie recensioni completata.');
  }
}