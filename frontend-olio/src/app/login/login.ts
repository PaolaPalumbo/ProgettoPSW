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
  avvisoAdmin = ''; // <-- Nuova variabile per l'avviso persistente
  isAdminLogin = false; 

  constructor(
    private utenteService: UtenteService, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // <-- Iniettato nel costruttore
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Se arriviamo dalla adminGuard, impostiamo l'avviso
      if (params['error'] === 'admin_only') {
        this.isAdminLogin = true;
        this.avvisoAdmin = 'Area riservata agli amministratori. Effettua il login per procedere.';
      }
    });
  }

  onSubmit() {
    this.messaggioErrore = ''; // Puliamo solo l'errore, non l'avvisoAdmin

    // PULIZIA PREVENTIVA: Eliminiamo i dati vecchi prima di procedere
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.utenteService.login(this.credenziali).subscribe({
      next: (response: any) => { // <-- Tipizzato per lo Strict Mode
        console.log('Login effettuato con successo!');
        
        // --- PASSAGGIO FONDAMENTALE: SALVATAGGIO TOKEN E RUOLO ---
        // Se il backend invia un token e un ruolo, li salviamo subito nel localStorage
        let token = typeof response === 'string' ? response : response.token;
        let ruolo = response.ruolo;

        // FORZATURA DI SICUREZZA PER LA TESI:
        // Determino il ruolo in base all'email se il backend non lo invia
        if (!ruolo && this.credenziali.email.toLowerCase() === 'admin@oleumfamiliae.it') {
            ruolo = 'ADMIN';
        } else if (!ruolo) {
            ruolo = 'USER';
        }

        if (token) {
          // salvaSessione ora notifica il BehaviorSubject (authStatus$)
          this.utenteService.salvaSessione({ token, ruolo });
          console.log("Dati sessione salvati con ruolo:", ruolo);
        }
        
        // --- NAVIGAZIONE SICURA CON RITARDO ---
        // Attendiamo un breve ciclo per assicurarci che l'app 
        // abbia recepito il nuovo stato di autenticazione
        setTimeout(() => {
          // NAVIGAZIONE INTELLIGENTE: 
          // Utilizziamo la variabile locale 'ruolo' per garantire coerenza immediata
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (ruolo === 'ADMIN' ? '/login/admin' : '/');
          this.router.navigateByUrl(returnUrl);
        }, 50); 
      },
      error: (err: any) => { // <-- Tipizzato per lo Strict Mode
        console.error('Errore dal server:', err);

        if (err.status === 401 || err.status === 403 || err.status === 404) {
          this.messaggioErrore = this.isAdminLogin
            ? 'Credenziali non valide o permessi insufficienti per l\'area Admin.'
            : 'Credenziali inesistenti. Verifica la tua email o registrati.'; // <-- Modificato come richiesto
        } else {
          this.messaggioErrore = 'Impossibile connettersi al server. Riprova più tardi.';
        }
        
        // <-- Aggiunto per forzare l'aggiornamento dell'HTML
        this.cdr.detectChanges(); 
      }
    });
  }
}