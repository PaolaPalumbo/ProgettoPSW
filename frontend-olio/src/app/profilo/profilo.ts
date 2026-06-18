import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Ho importato ChangeDetectorRef
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
  ordini: any[] = [];
  recensioni: any[] = [];
  
  caricamento: boolean = true;
  messaggioErrore: string = '';
  sezioneAttiva: 'ordini' | 'recensioni' = 'ordini';

  private apiUrl = 'http://localhost:8080/api/ordini/miei'; 

  constructor(
    private http: HttpClient,
    private utenteService: UtenteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Inietto il ChangeDetector per forzare l'aggiornamento
  ) {}

  ngOnInit() {
    if (!this.utenteService.isLoggedIn()) {
      console.log('Accesso negato: devo prima fare il login.');
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe(params => {
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

  cambiaSezione(sezione: 'ordini' | 'recensioni') {
    this.sezioneAttiva = sezione;
  }

  caricaOrdini() {
    this.messaggioErrore = ''; 
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Ho ricevuto i dati:', data); // Debug: vedo cosa arriva
        this.ordini = data;
        this.caricamento = false; // Fermo lo spinner
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      },
      error: (err) => {
        console.error('Errore durante il recupero ordini:', err);
        this.messaggioErrore = 'Non è stato possibile caricare i miei ordini.';
        this.caricamento = false; // Fermo lo spinner
        this.cdr.detectChanges(); // Forza l'aggiornamento della UI
      }
    });
  }

  caricaRecensioni() {
    console.log('Caricamento recensioni...');
    this.caricamento = false; 
    this.cdr.detectChanges(); // Forza l'aggiornamento della UI
  }
}