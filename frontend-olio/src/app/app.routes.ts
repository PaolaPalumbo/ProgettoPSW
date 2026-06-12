import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';
import { AdminRecensioniComponent } from './admin-recensioni/admin-recensioni';

export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'admin/recensioni', component: AdminRecensioniComponent },
  { path: '**', redirectTo: '' } // Se non trova nulla, rimanda alla home
];