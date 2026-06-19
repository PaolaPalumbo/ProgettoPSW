import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  // Stato per l'hamburger menu (mobile)
  isMenuAperto: boolean = false;
  
  // Stato per la tendina Area Personale
  isDropdownAperto: boolean = false;

  // Stato locale per l'autenticazione
  isLoggedIn: boolean = false;

  constructor(
    public carrelloService: CarrelloService,
    public utenteService: UtenteService,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- INIETTATO: Strumento per forzare il rendering
  ) {}

  ngOnInit() {
    // 1. Lettura immediata dello stato all'avvio
    this.isLoggedIn = this.utenteService.isLoggedIn();

    // 2. Sottoscrizione al cambio di stato in tempo reale
    this.utenteService.authStatus$.subscribe(stato => {
      this.isLoggedIn = stato;
      this.cdr.detectChanges(); // <-- FORZATURA: Diciamo ad Angular di aggiornare l'HTML all'istante
    });
  }

  get contatore(): number {
    return this.carrelloService.getNumeroArticoli();
  }

  // --- AGGIORNATO: Ora usa la variabile locale aggiornata dal BehaviorSubject ---
  isAdmin(): boolean {
    return this.isLoggedIn && this.utenteService.hasRole('ADMIN');
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
    this.chiudiDropdown();
    this.isLoggedIn = false;                
    this.router.navigate(['/']);
  }
}