import { HttpInterceptorFn } from '@angular/common/http';

// L'AuthInterceptor funge da filtro di sicurezza per le richieste HTTP in uscita.
// Il suo scopo è iniettare automaticamente il token JWT nell'header 'Authorization'
// di ogni chiamata, garantendo che il backend riconosca l'identità dell'utente autenticato.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Recupero il token JWT dal localStorage, dove è stato salvato al momento del login.
  const token = localStorage.getItem('token');
  
  if (token) {
    // Se il token è presente, clono la richiesta originale aggiungendo l'header 'Authorization'.
    // Utilizzo lo schema 'Bearer', standard industriale per l'autenticazione basata su token.
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    
    // Procedo con la richiesta clonata e arricchita.
    return next(cloned);
  }
  
  // Se non c'è alcun token, inoltro la richiesta originale senza alcuna modifica.
  return next(req);
};