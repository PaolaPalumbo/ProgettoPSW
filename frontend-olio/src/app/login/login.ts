import { Component } from '@angular/core';
import { Router,RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../services/utente.service'; // Path corretto!

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credenziali = {
    email: '',
    password: ''
  };
  messaggioErrore = '';

  constructor(private utenteService: UtenteService, private router: Router) {}

  onSubmit() {
    console.log('--- SUBMIT AVVIATO ---'); // Test 1
    console.log('Credenziali inviate:', this.credenziali); // Test 2
    this.messaggioErrore = ''; // Resetta l'errore
    
    this.utenteService.login(this.credenziali).subscribe({
      next: (response) => {
        console.log('Login effettuato con successo!');
        // Se il login va a buon fine, navighiamo verso il catalogo
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Errore dal server:', err);
        // Catturiamo esplicitamente l'errore 401 o 403
        if (err.status === 401 || err.status === 403) {
          this.messaggioErrore = 'Email o password errate. Riprova.';
        } else {
          this.messaggioErrore = 'Impossibile connettersi al server. Riprova più tardi.';
        }
      }
    });
  }
}