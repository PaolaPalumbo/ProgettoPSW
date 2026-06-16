import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
import { CarrelloComponent } from './carrello/carrello';
import { StoriaComponent } from './storia/storia'; 
import { TenuteComponent } from './tenute/tenute'; 

export const routes: Routes = [
  { 
    path: '', 
    component: CatalogoComponent,
    // Forza il ricaricamento della rotta ogni volta che l'utente accede alla home
    runGuardsAndResolvers: 'always' 
  },
  { path: 'carrello', component: CarrelloComponent },
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  { path: 'storia', component: StoriaComponent }, // Collega la rotta al nuovo componente
  { path: 'tenute', component: TenuteComponent },
  { path: 'prodotti', component: CatalogoComponent }, // Aggiunta la rotta per I NOSTRI PRODOTTI
  { path: '**', redirectTo: '' } // Se non trova nulla, rimanda alla home
];