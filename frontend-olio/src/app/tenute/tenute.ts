import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tenute',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tenute.html',
  styleUrl: './tenute.css'
})
export class TenuteComponent {
  // Il componente è pronto per la visualizzazione
}