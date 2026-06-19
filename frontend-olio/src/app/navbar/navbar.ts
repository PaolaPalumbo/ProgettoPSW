import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { CarrelloService } from '../carrello'; 
import { UtenteService } from '../services/utente.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // Stato per l'hamburger menu (mobile)
  isMenuAperto: boolean = false;
  
  // Stato per la tendina Area Personale
  isDropdownAperto: boolean = false;

  constructor(
    public carrelloService: CarrelloService,
    public utenteService: UtenteService,
    private router: Router
  ) {}

  get contatore(): number {
    return this.carrelloService.getNumeroArticoli();
  }

  // --- NUOVO: Controllo ruolo per la UI ---
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  // Hamburger Menu
  toggleMenu(): void {
    this.isMenuAperto = !this.isMenuAperto;
  }

  chiudiMenu(): void {
    this.isMenuAperto = false;
  }

  // --- LOGICA PER IL DROPDOWN AREA PERSONALE ---
  toggleDropdown(): void {
    this.isDropdownAperto = !this.isDropdownAperto;
  }

  chiudiDropdown(): void {
    this.isDropdownAperto = false;
  }

  // Logout
  logout(): void {
    this.utenteService.logout();
    this.router.navigate(['/']);
  }
}