import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Aggiunto Router per il redirect dopo il logout
import { CarrelloService } from '../carrello'; 
import { UtenteService } from '../services/utente.service'; // Importo il mio servizio utente

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // Variabile che controlla lo stato della tendina (aperta/chiusa)
  isMenuAperto: boolean = false;

  // Iniezione dei servizi nel costruttore. 
  // FONDAMENTALE: sia carrelloService che utenteService sono 'public' per poterli usare nell'HTML!
  constructor(
    public carrelloService: CarrelloService,
    public utenteService: UtenteService,
    private router: Router
  ) {}

  // Getter per avere il numero del carrello aggiornato in tempo reale
  get contatore(): number {
    return this.carrelloService.getNumeroArticoli();
  }

  // Metodo che scatta quando clicco sulle "tre lineette" (bottone hamburger)
  toggleMenu(): void {
    this.isMenuAperto = !this.isMenuAperto;
  }

  // Metodo per nascondere la tendina appena clicco su una voce del menu
  chiudiMenu(): void {
    this.isMenuAperto = false;
  }

  // Metodo per uscire: cancello il token e chiudo la sessione
  logout(): void {
    this.utenteService.logout();
    this.router.navigate(['/']); // Mi riporta alla home page dopo essere uscita
  }
}