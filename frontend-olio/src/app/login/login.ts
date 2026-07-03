import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../services/utente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  credenziali = {
    email: '',
    password: ''
  };
  messaggioErrore = '';
  avvisoAdmin = ''; // Variabile che uso per il mio avviso persistente
  isAdminLogin = false; 

  constructor(
    private utenteService: UtenteService, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // <-- Inietto il ChangeDetector nel mio costruttore
  ) {}

  ngOnInit() {
    // --- IL MIO NUOVO CONTROLLO DI COERENZA VISIVA ---
    // Se sono già loggato (es. ho il token nel sessionStorage),
    // mi reindirizzo alla Home per evitare di vedere di nuovo il mio form di login
    if (this.utenteService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      // Se arrivo dalla adminGuard, imposto il mio avviso
      if (params['error'] === 'admin_only') {
        this.isAdminLogin = true;
        this.avvisoAdmin = 'Area riservata agli amministratori. Effettua il login per procedere.';
      }
    });
  }

  onSubmit() {
    this.messaggioErrore = ''; // Pulisco solo il mio errore, non l'avvisoAdmin

    // LA MIA PULIZIA PREVENTIVA: Elimino i miei dati vecchi prima di procedere
    // Uso sessionStorage.clear() in coerenza con le mie policy di sicurezza
    sessionStorage.clear(); 
    localStorage.removeItem('utente'); // Pulisco preventivamente anche il mio riferimento locale per il checkout

    this.utenteService.login(this.credenziali).subscribe({
      next: (response: any) => { // <-- Tipizzo la response per il mio Strict Mode
        console.log('Login effettuato con successo!');
        
        // --- PASSAGGIO FONDAMENTALE: SALVO IL MIO TOKEN E RUOLO ---
        // Se il backend mi invia un token e un ruolo, li salvo subito nel mio sessionStorage
        let token = typeof response === 'string' ? response : response.token;
        let ruolo = response.ruolo;
        let idUtente = response.id || (response.utente ? response.utente.id : null);

        // LA MIA FORZATURA DI SICUREZZA:
        // Determino il mio ruolo in base all'email se il backend non me lo invia
        if (!ruolo && this.credenziali.email.toLowerCase() === 'admin@oleumfamiliae.it') {
            ruolo = 'ADMIN';
        } else if (!ruolo) {
            ruolo = 'USER';
        }

        if (token) {
          // Uso salvaSessione per notificare il BehaviorSubject 
          this.utenteService.salvaSessione({ token, ruolo });
          console.log("Dati sessione salvati con ruolo:", ruolo);
          
          // Sincronizzo il mio oggetto utente atteso dal Checkout sia in localStorage che sessionStorage
          const utenteSessione = { id: idUtente, email: this.credenziali.email, ruolo: ruolo };
          localStorage.setItem('utente', JSON.stringify(utenteSessione));
          sessionStorage.setItem('utente', JSON.stringify(utenteSessione));
        }
        
        // --- LA MIA NAVIGAZIONE SICURA CON VERIFICA ---
        // Prima di navigare, verifico che il mio token sia effettivamente presente
        const checkToken = () => {
          if (this.utenteService.isLoggedIn()) {
             const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (ruolo === 'ADMIN' ? '/login/admin' : '/');
             this.router.navigateByUrl(returnUrl);
          } else {
             // Se il mio browser è lento, riprovo dopo pochissimi millisecondi
             setTimeout(checkToken, 50);
          }
        };

        checkToken();
      },
      error: (err: any) => { // <-- Tipizzo l'errore per il mio Strict Mode
        console.error('Errore dal server:', err);

        if (err.status === 401 || err.status === 403 || err.status === 404) {
          this.messaggioErrore = this.isAdminLogin
            ? 'Credenziali non valide o permessi insufficienti per l\'area Admin.'
            : 'Credenziali inesistenti. Verifica la tua email o registrati.'; 
        } else {
          this.messaggioErrore = 'Impossibile connettersi al server. Riprova più tardi.';
        }
        
        // Forzo l'aggiornamento del mio HTML
        this.cdr.detectChanges(); 
      }
    });
  }
}