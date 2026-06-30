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
  avvisoAdmin = ''; //variabile per l'avviso persistente
  isAdminLogin = false; 

  constructor(
    private utenteService: UtenteService, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // <-- Iniettato nel costruttore
  ) {}

  ngOnInit() {
    // --- NUOVO CONTROLLO DI COERENZA VISIVA ---
    // Se l'utente è già loggato (es. token nel sessionStorage),
    // lo reindirizzo alla Home per evitare che veda di nuovo il form di login
    if (this.utenteService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      // Se arrivo dalla adminGuard, imposto l'avviso
      if (params['error'] === 'admin_only') {
        this.isAdminLogin = true;
        this.avvisoAdmin = 'Area riservata agli amministratori. Effettua il login per procedere.';
      }
    });
  }

  onSubmit() {
    this.messaggioErrore = ''; // Pulisco solo l'errore, non l'avvisoAdmin

    // PULIZIA PREVENTIVA: Elimino i dati vecchi prima di procedere
    // <Uso sessionStorage.clear() in coerenza con le policy di sicurezza
    sessionStorage.clear(); 
    localStorage.removeItem('utente'); // Pulisco preventivamente anche il riferimento locale per il checkout

    this.utenteService.login(this.credenziali).subscribe({
      next: (response: any) => { // <-- Tipizzato per lo Strict Mode
        console.log('Login effettuato con successo!');
        
        // --- PASSAGGIO FONDAMENTALE: SALVATAGGIO TOKEN E RUOLO ---
        // Se il backend invia un token e un ruolo, li salvo subito nel sessionStorage
        let token = typeof response === 'string' ? response : response.token;
        let ruolo = response.ruolo;
        let idUtente = response.id || (response.utente ? response.utente.id : null);

        // FORZATURA DI SICUREZZA:
        // Determino il ruolo in base all'email se il backend non lo invia
        if (!ruolo && this.credenziali.email.toLowerCase() === 'admin@oleumfamiliae.it') {
            ruolo = 'ADMIN';
        } else if (!ruolo) {
            ruolo = 'USER';
        }

        if (token) {
          // salvaSessione notifica il BehaviorSubject 
          this.utenteService.salvaSessione({ token, ruolo });
          console.log("Dati sessione salvati con ruolo:", ruolo);
          
          // Sincronizzo l'oggetto utente atteso dal Checkout sia in localStorage che sessionStorage
          const utenteSessione = { id: idUtente, email: this.credenziali.email, ruolo: ruolo };
          localStorage.setItem('utente', JSON.stringify(utenteSessione));
          sessionStorage.setItem('utente', JSON.stringify(utenteSessione));
        }
        
        // --- NAVIGAZIONE SICURA CON VERIFICA ---
        // Prima di navigare, verifico che il token sia effettivamente presente
        const checkToken = () => {
          if (this.utenteService.isLoggedIn()) {
             const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (ruolo === 'ADMIN' ? '/login/admin' : '/');
             this.router.navigateByUrl(returnUrl);
          } else {
             // Se il browser è lento, riprovo dopo pochissimi millisecondi
             setTimeout(checkToken, 50);
          }
        };

        checkToken();
      },
      error: (err: any) => { // <-- Tipizzato per lo Strict Mode
        console.error('Errore dal server:', err);

        if (err.status === 401 || err.status === 403 || err.status === 404) {
          this.messaggioErrore = this.isAdminLogin
            ? 'Credenziali non valide o permessi insufficienti per l\'area Admin.'
            : 'Credenziali inesistenti. Verifica la tua email o registrati.'; 
        } else {
          this.messaggioErrore = 'Impossibile connettersi al server. Riprova più tardi.';
        }
        
        // per forzare l'aggiornamento dell'HTML
        this.cdr.detectChanges(); 
      }
    });
  }
}