import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
import { AdminComponent } from './admin/admin'; // <-- IMPORTATO: Il tuo nuovo componente Admin
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
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  
  // <-- AGGIUNTO: La rotta protetta per la Dashboard Amministratore
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  
  { path: 'storia', component: StoriaComponent }, 
  { path: 'tenute', component: TenuteComponent },
  { path: 'prodotti', component: CatalogoComponent }, 
  
  { path: 'profilo', component: ProfiloComponent },
  
  // Questa rotta "jolly" deve stare SEMPRE e RIGOROSAMENTE per ultima
  { path: '**', redirectTo: '' } 
];