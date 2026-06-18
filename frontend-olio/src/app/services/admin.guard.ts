import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtenteService } from '../services/utente.service';

// Io controllo se l'utente è loggato E se ha il ruolo ADMIN
export const adminGuard = () => {
  const utenteService = inject(UtenteService);
  const router = inject(Router);

  // Io controllo se sono loggata e se il mio ruolo è ADMIN
  if (utenteService.isLoggedIn() && utenteService.hasRole('ADMIN')) {
    return true; // Passo libera
  }

  // Se non sono admin, ti rimando al login con un segnale di errore
  console.log('Accesso negato: non sei un amministratore.');
  router.navigate(['/login'], { queryParams: { error: 'admin_only' } });
  return false;
};