import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo'; // o ./catalogo/catalogo a seconda del nome del file

export const routes: Routes = [
  // Dico ad Angular: quando il percorso è vuoto (Home Page), mostra il Catalogo
  { path: '', component: CatalogoComponent } 
];