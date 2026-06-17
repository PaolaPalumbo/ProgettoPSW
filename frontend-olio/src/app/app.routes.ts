import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
import { CarrelloComponent } from './carrello/carrello';
import { StoriaComponent } from './storia/storia'; 
import { TenuteComponent } from './tenute/tenute'; 
import { LoginComponent } from './login/login';
import { RegistrazioneComponent } from './registrazione/registrazione';
import { utenteGuard } from './interceptors/utente.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: CatalogoComponent,
    // Forza il ricaricamento della rotta ogni volta che l'utente accede alla home
    runGuardsAndResolvers: 'always' 
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'carrello', component: CarrelloComponent },
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  { path: 'storia', component: StoriaComponent }, 
  { path: 'tenute', component: TenuteComponent },
  { path: 'prodotti', component: CatalogoComponent }, 
  
  // Questa rotta "jolly" deve stare SEMPRE e RIGOROSAMENTE per ultima
  { path: '**', redirectTo: '' } 
];