import { Routes } from '@angular/router';
import { HomeComponent } from './home/home'; 
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
// nuovo componente AdminDashboard (sostituisce il vecchio AdminComponent)
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard'; 
import { CarrelloComponent } from './carrello/carrello';
import { StoriaComponent } from './storia/storia'; 
import { TenuteComponent } from './tenute/tenute'; 
import { LoginComponent } from './login/login';
import { RegistrazioneComponent } from './registrazione/registrazione';
import { ProfiloComponent } from './profilo/profilo'; 
import { utenteGuard } from './interceptors/utente.guard';
import { adminGuard } from './services/admin.guard';
import { CheckoutComponent } from './checkout/checkout';
import { ContattiComponent } from './contatti/contatti';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, // <--la Home è il punto di ingresso
    runGuardsAndResolvers: 'always' 
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'carrello', component: CarrelloComponent },
  
  // Rotta per il Checkout protetta da utenteGuard
  { path: 'checkout', component: CheckoutComponent, canActivate: [utenteGuard] },
  
  // Vecchio componente recensioni (lo lascio per non rompere vecchi link se serve)
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  
  //Rotta protetta riattivata con adminGuard
  { path: 'login/admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  
  { path: 'storia', component: StoriaComponent }, 
  { path: 'tenute', component: TenuteComponent },
  { path: 'prodotti', component: CatalogoComponent }, 
  
  //Rotta pubblica per la pagina contatti
  { path: 'contatti', component: ContattiComponent }, 
  
  //l'accesso al profilo richiede il login verificato dalla utenteGuard
  { path: 'profilo', component: ProfiloComponent, canActivate: [utenteGuard] },
  
  // Questa rotta "jolly" deve stare SEMPRE e RIGOROSAMENTE per ultima
  { path: '**', redirectTo: '' } 
];
//Serve a gestire i casi in cui l'utente tenta di accedere a una pagina che non ho previsto nel codice