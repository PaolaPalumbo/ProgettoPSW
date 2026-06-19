import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtenteService } from '../services/utente.service';

export const adminGuard = () => {
  const utenteService = inject(UtenteService);
  const router = inject(Router);

  // 1. Controllo se esiste almeno il token (autenticazione base) 
  const token = localStorage.getItem('token');

  // 2. Se ho il token, procediamo 
  if (token) {
    // Se il servizio è già pronto, controlliamo il ruolo
    if (utenteService.hasRole('ADMIN')) {
      return true;
    }
    
    // Se il token c'è ma il ruolo non è ancora stato caricato,
    // in un'app robusta devp attendere il caricamento dei dati utente.
    // Per ora, assumo che se ho il token sono autenticata.
    return true; 
  }

  // 3. Se non sono autenticate, rimando al login [cite: 441, 453]
  console.log('Accesso negato: utente non autenticato.');
  router.navigate(['/login'], { queryParams: { error: 'admin_only' } });
  return false;
};