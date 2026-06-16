import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Aggiunto solo un punto e virgola qui per precisione
import { CarrelloService } from '../carrello'; // Importiamo il servizio

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

  // Iniezione del servizio nel costruttore
  constructor(public carrelloService: CarrelloService) {}

  // Getter per avere il numero aggiornato in tempo reale
  get contatore(): number {
    return this.carrelloService.getNumeroArticoli();
  }

  //  Metodo che scatta quando clicchi sulle "tre lineette" (bottone hamburger)
  toggleMenu(): void {
    this.isMenuAperto = !this.isMenuAperto;
  }

  // Metodo per nascondere la tendina appena l'utente clicca su una voce del menu
  chiudiMenu(): void {
    this.isMenuAperto = false;
  }
}