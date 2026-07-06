import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtenteService } from '../services/utente.service';

export const adminGuard = () => {
  const utenteService = inject(UtenteService);
  const router = inject(Router);

  // 1. Controllo se esiste almeno il token (autenticazione base) 
  // Allineato a sessionStorage per la sicurezza
  const token = sessionStorage.getItem('token');

  // 2. Se ho il token, procedo
  if (token) {
    // Se il servizio è già pronto, controlliamo il ruolo
    if (utenteService.hasRole('ADMIN')) {
      return true;
    }
    
    // Se il token c'è ma il ruolo non è ancora stato caricato,
    // in un'app robusta devp attendere il caricamento dei dati utente.
    //Blocco l'accesso a chi non è ADMIN, altrimenti la Guard è inutile.
    console.log('Accesso negato: utente autenticato ma permessi insufficienti.');
    router.navigate(['/']); // Redirige un utente standard alla home
    return false; 
  }

  // 3. Se non sono autenticate, rimando al login
  console.log('Accesso negato: utente non autenticato.');
  router.navigate(['/login'], { queryParams: { error: 'admin_only' } });
  return false;
};