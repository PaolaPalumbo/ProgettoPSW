import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'
import { CarrelloService } from '../carrello'; // Importiamo il servizio

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // Iniezione del servizio nel costruttore
  constructor(public carrelloService: CarrelloService) {}

  // Getter per avere il numero aggiornato in tempo reale
  get contatore(): number {
    return this.carrelloService.getNumeroArticoli();
  }
}