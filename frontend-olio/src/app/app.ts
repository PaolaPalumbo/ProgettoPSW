import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { UtenteService } from './services/utente.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'frontend-olio';

  constructor(private utenteService: UtenteService) {}

  ngOnInit() {
    // Controllo di sicurezza globale all'avvio dell'app:
    // Se non c'è il token nel localStorage, mi assicuro che il servizio sia pulito.
    // Questo previene che l'app parta in uno stato incoerente.
    if (!this.utenteService.isLoggedIn()) {
      this.utenteService.logout();
    }
  }
}