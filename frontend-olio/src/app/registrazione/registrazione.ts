import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../services/utente.service';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrazione.html',
  styleUrls: ['./registrazione.css']
})
export class RegistrazioneComponent {
  nuovoUtente = {
    nome: '',
    email: '',
    password: ''
  };
  messaggioErrore = '';
  messaggioSuccesso = '';

  constructor(private utenteService: UtenteService, private router: Router) {}

  onSubmit() {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.utenteService.registrazione(this.nuovoUtente).subscribe({
      next: (response) => {
        this.messaggioSuccesso = 'Registrazione completata! Reindirizzamento al login...';
        // Aspetta 2 secondi per far leggere il messaggio e poi va al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Errore durante la registrazione:', err);
        this.messaggioErrore = 'Impossibile completare la registrazione. L\'email potrebbe essere già in uso.';
      }
    });
  }
}