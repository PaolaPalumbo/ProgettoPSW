import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UtenteService } from '../services/utente.service'; // Path corretto!

export const utenteInterceptor: HttpInterceptorFn = (req, next) => {
  const utenteService = inject(UtenteService);
  const token = utenteService.getToken();
// Se il token esiste, clono la richiesta originale e aggiungo
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

/* PERCHE' CLONO?
Gli oggetti HTTP in Angular sono immutabili, quindi devo clonarli per aggiungere intestazioni. 
In pratica, se non clono la richiesta, non posso settare Authorization: Bearer ${token}*/