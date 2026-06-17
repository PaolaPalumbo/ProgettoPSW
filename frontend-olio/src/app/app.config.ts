import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { utenteInterceptor } from './services/utente.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withRouterConfig({ onSameUrlNavigation: 'reload' }) 
    ),
    provideHttpClient(),
    provideHttpClient(withInterceptors([utenteInterceptor]))
  ]
};