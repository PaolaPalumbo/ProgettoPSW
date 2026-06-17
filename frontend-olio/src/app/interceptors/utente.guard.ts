import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UtenteService } from '../services/utente.service';

export const utenteGuard: CanActivateFn = (route, state) => {
  const utenteService = inject(UtenteService);
  const router = inject(Router);

  if (utenteService.isLoggedIn()) {
    return true; // Accesso consentito
  } else {
    // Se non loggato, reindirizza al login
    router.navigate(['/login']);
    return false;
  }
};