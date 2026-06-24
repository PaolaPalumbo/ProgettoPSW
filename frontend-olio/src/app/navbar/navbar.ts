import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { CarrelloService } from '../services/carrello.service';
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

  // <-- AGGIUNTO: Variabile reattiva per il contatore del carrello
  numeroArticoli: number = 0;

  constructor(
    public carrelloService: CarrelloService,
    public utenteService: UtenteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Lettura immediata dello stato all'avvio
    this.isLoggedIn = this.utenteService.isLoggedIn();

    // 2. Sottoscrizione al cambio di stato in tempo reale (Login)
    this.utenteService.authStatus$.subscribe(stato => {
      this.isLoggedIn = stato;
      this.cdr.detectChanges(); 
    });

    // 3. <-- AGGIUNTO: Sottoscrizione al contatore del carrello in tempo reale
    this.carrelloService.contatore$.subscribe(numero => {
      this.numeroArticoli = numero;
      this.cdr.detectChanges(); // <-- Aggiorna istantaneamente il badge
    });
  }

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
    this.carrelloService.svuotaCarrello(); // Pulisce la memoria del carrello all'uscita
    this.chiudiDropdown();
    this.isLoggedIn = false;                
    this.router.navigate(['/']);
  }
}