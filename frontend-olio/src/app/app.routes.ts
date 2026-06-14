import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';
import { CarrelloComponent } from './carrello/carrello';

export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'carrello', component: CarrelloComponent },
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  { path: '**', redirectTo: '' } // Se non trova nulla, rimanda alla home
];