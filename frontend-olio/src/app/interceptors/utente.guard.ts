import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UtenteService } from '../services/utente.service';

export const utenteGuard: CanActivateFn = (route, state) => {
  const utenteService = inject(UtenteService);
  const router = inject(Router);

  // Verifico direttamente lo stato di login
  if (utenteService.isLoggedIn()) {
    return true; 
  } else {
    // Prima di reindirizzare, controllo se il login è in corso.
    // Se non c'è il token, impedisco l'accesso e mando al login
    // aggiungendo l'URL di destinazione per ritornarci dopo il login corretto.
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};