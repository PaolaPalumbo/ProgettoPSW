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
    // 2. Aggiorniamo il costruttore per usare la classe corretta
    private catalogoService: CatalogoService, 
    private recensioneService: RecensioneService
  ) {}

  ngOnInit() {
    this.caricaDati();
  }

  caricaDati() {
    // 1. Carica le recensioni in attesa (verifica che il metodo nel service si chiami così)
    this.recensioneService.getRecensioniInAttesa().subscribe({
      next: (dati: any) => this.recensioniDaApprovare = dati, // <-- Tipizzato con : any
      error: (err: any) => console.error('Errore nel caricamento recensioni', err) // <-- Tipizzato con : any
    });

    // 2. Carica l'inventario prodotti
    this.catalogoService.getProdotti().subscribe({
      next: (dati: any) => this.catalogoProdotti = dati, // <-- Tipizzato con : any
      error: (err: any) => console.error('Errore nel caricamento prodotti', err) // <-- Tipizzato con : any
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
        // Ricarica i dati per far sparire la recensione appena approvata dalla tabella
        this.caricaDati(); 
      },
      error: (err: any) => console.error('Errore durante l\'approvazione', err) // <-- Tipizzato con : any
    });
  }

  aggiornaScorte(id: number, nuovaQuantita: number) {
    this.catalogoService.aggiornaQuantita(id, nuovaQuantita).subscribe({
      next: () => {
        console.log('Scorte aggiornate con successo!');
        alert('Quantità aggiornata a magazzino!');
      },
      error: (err: any) => { // <-- Tipizzato con : any
        console.error('Errore durante l\'aggiornamento scorte', err);
        alert('Errore durante il salvataggio.');
      }
    });
  }
}