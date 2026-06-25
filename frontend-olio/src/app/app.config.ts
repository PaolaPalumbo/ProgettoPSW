import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';//per navigare nelle pagine
import { routes } from './app.routes';//indica la cartella locale corrente
import { provideHttpClient, withInterceptors } from '@angular/common/http'; //per cominicare con il backand in sicurezza
import { utenteInterceptor } from './services/utente.interceptor'; //per la sicurezza


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withRouterConfig({ onSameUrlNavigation: 'reload' }) // forzo Angular a "ricaricare" il componente anche se ci si trova già sopra.
    ),
    //provideHttpClient(), //fornisco httpclient per fare chiamate di GET e POST nei Servizi
    provideHttpClient(withInterceptors([utenteInterceptor]))
  ]
};

/*Ogni singola richiesta HTTP in uscita dal sito verso Spring 
Boot passerà prima da utenteInterceptor. Di solito si usa per
 "agganciare" automaticamente un Token di sicurezza (JWT) a 
 ogni chiamata, in modo che Spring Boot sappia sempre che 
 l'utente è loggato e autorizzato. */