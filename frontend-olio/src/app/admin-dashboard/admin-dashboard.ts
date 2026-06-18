import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../services/catalogo.service';
import { RecensioneService } from '../services/recensione.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
  sezioneAttiva: 'recensioni' | 'inventario' = 'recensioni'; 
  
  recensioniDaApprovare: any[] = [];
  catalogoProdotti: any[] = [];

  constructor(
    private catalogoService: CatalogoService, 
    private recensioneService: RecensioneService
  ) {}

  ngOnInit() {
    this.caricaDati();
  }

  caricaDati() {
    this.recensioneService.getRecensioniInAttesa().subscribe({
      next: (dati: any) => this.recensioniDaApprovare = dati,
      error: (err: any) => console.error('Errore nel caricamento recensioni', err)
    });

    this.catalogoService.getProdotti().subscribe({
      next: (dati: any) => this.catalogoProdotti = dati,
      error: (err: any) => console.error('Errore nel caricamento prodotti', err)
    });
  }

  cambiaSezione(sezione: 'recensioni' | 'inventario') {
    this.sezioneAttiva = sezione;
  }

  // --- AZIONI DELL'AMMINISTRATORE ---

  approvaRecensione(id: number) {
    this.recensioneService.approva(id).subscribe({
      next: () => {
        console.log('Recensione approvata!');
        this.caricaDati(); 
      },
      error: (err: any) => console.error('Errore durante l\'approvazione', err)
    });
  }

  aggiornaScorte(id: number, nuovaQuantita: number) {
    // DEBUG: Verifichiamo il token prima di inviare
    const token = localStorage.getItem('token');
    console.log("DEBUG - Token presente nel localStorage:", token ? "SÌ" : "NO");

    this.catalogoService.aggiornaQuantita(id, nuovaQuantita).subscribe({
      next: () => {
        console.log('Scorte aggiornate con successo!');
        alert('Quantità aggiornata a magazzino!');
      },
      error: (err: any) => { 
        // DEBUG: Stampiamo l'errore completo per vedere il codice di stato
        console.error('DETTAGLIO ERRORE SERVER:', err);
        alert('Errore durante il salvataggio. Controlla la console (F12).');
      }
    });
  }
}