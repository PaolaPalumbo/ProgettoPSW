import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Recupera il token salvato dopo il login
  const token = localStorage.getItem('auth-token');

  if (token) {
    // Clona la richiesta e aggiunge l'header Authorization
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    return next(cloned);
  }

  return next(req);
};