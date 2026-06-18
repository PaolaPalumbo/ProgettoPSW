import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
export class LoginComponent {
  credenziali = {
    email: '',
    password: ''
  };
  messaggioErrore = '';

  constructor(private utenteService: UtenteService, private router: Router) {}

  onSubmit() {
    // Resetto l'errore ad ogni nuovo tentativo per pulire l'interfaccia
    this.messaggioErrore = ''; 
    
    this.utenteService.login(this.credenziali).subscribe({
      next: (response) => {
        console.log('Login effettuato con successo!');
        
        // Se il login va a buon fine, navigo verso il catalogo
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Errore dal server:', err);
        
        // Catturo esplicitamente l'errore 401 o 403 per dare un feedback all'utente
        if (err.status === 401 || err.status === 403) {
          this.messaggioErrore = 'Email o password errate. Riprova.';
        } else {
          this.messaggioErrore = 'Impossibile connettersi al server. Riprova più tardi.';
        }
      }
    });
  }
}