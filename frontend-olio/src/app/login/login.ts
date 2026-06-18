import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Aggiunto ChangeDetectorRef
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

    this.utenteService.login(this.credenziali).subscribe({
      next: (response: any) => { // <-- Tipizzato per lo Strict Mode
        console.log('Login effettuato con successo!');
        
        // --- PASSAGGIO FONDAMENTALE: SALVATAGGIO TOKEN ---
        // Se il backend invia un token, lo salviamo subito nel localStorage
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log("Token salvato nel localStorage.");
        }
        
        // --- NUOVO BIVIO DI NAVIGAZIONE CON RITARDO ---
        // Usiamo setTimeout per evitare conflitti con la adminGuard
        setTimeout(() => {
          const emailInserita = this.credenziali.email.trim().toLowerCase();

          // Controlliamo se l'utente che ha appena fatto login è un amministratore
          if (this.isAdminLogin || emailInserita === 'admin@oleumfamiliae.it') {
            this.router.navigate(['/login/admin']); // Rotta per la Dashboard Admin
          } else {
            this.router.navigate(['/']); // Rotta per i clienti normali (Vetrina/Home)
          }
        }, 100);
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