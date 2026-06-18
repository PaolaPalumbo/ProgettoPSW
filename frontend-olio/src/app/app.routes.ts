import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
// <-- IMPORTATO: Il tuo nuovo componente AdminDashboard (sostituisce il vecchio AdminComponent)
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard'; 
import { CarrelloComponent } from './carrello/carrello';
import { StoriaComponent } from './storia/storia'; 
import { TenuteComponent } from './tenute/tenute'; 
import { LoginComponent } from './login/login';
import { RegistrazioneComponent } from './registrazione/registrazione';
import { ProfiloComponent } from './profilo/profilo'; 
import { utenteGuard } from './interceptors/utente.guard';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: CatalogoComponent,
    runGuardsAndResolvers: 'always' 
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'carrello', component: CarrelloComponent },
  
  // Vecchio componente recensioni (puoi lasciarlo per non rompere vecchi link se serve)
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  
  // <-- MODIFICATO: Rotta protetta riattivata con adminGuard
  { path: 'login/admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  
  { path: 'storia', component: StoriaComponent }, 
  { path: 'tenute', component: TenuteComponent },
  { path: 'prodotti', component: CatalogoComponent }, 
  
  { path: 'profilo', component: ProfiloComponent },
  
  // Questa rotta "jolly" deve stare SEMPRE e RIGOROSAMENTE per ultima
  { path: '**', redirectTo: '' } 
];