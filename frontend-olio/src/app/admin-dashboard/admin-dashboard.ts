import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../services/catalogo.service';
import { RecensioneService } from '../services/recensione.service';
import { OrdineService } from '../services/ordine.service'; // <-- AGGIUNTO: Importazione del servizio ordini
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
  sezioneAttiva: 'recensioni' | 'inventario' | 'spedizioni' = 'recensioni'; 
  
  recensioniDaApprovare: any[] = [];
  catalogoProdotti: any[] = [];
  
  //Array per contenere la lista degli ordini dei clienti
  ordiniClienti: any[] = []; 

  constructor( //DEPENDENCY INJECTION
    private catalogoService: CatalogoService, 
    private recensioneService: RecensioneService,
    private ordineService: OrdineService,
    private cdr: ChangeDetectorRef // Iniezione del ChangeDetector per forzare il render
  ) {}

  ngOnInit() {
   
      this.caricaDati();
   
  }

  caricaDati() {
    this.recensioneService.getRecensioniInAttesa().subscribe({
      next: (dati: any) => {
        this.recensioniDaApprovare = dati;
        this.cdr.detectChanges(); // <-- Forza l'aggiornamento visivo della tabella
      },
      error: (err: any) => console.error('Errore nel caricamento recensioni', err)
    });

    this.catalogoService.getProdotti().subscribe({
      next: (dati: any) => {
        this.catalogoProdotti = dati;
        this.cdr.detectChanges(); // <-- Forza l'aggiornamento visivo della tabella
      },
      error: (err: any) => console.error('Errore nel caricamento prodotti', err)
    });

    //Caricamento massivo di tutti gli ordini per la dashboard
    this.ordineService.getTuttiGliOrdini().subscribe({
      next: (dati: any) => {
        this.ordiniClienti = dati;
        this.cdr.detectChanges(); // <-- Forza l'aggiornamento visivo della tabella
      },
      error: (err: any) => console.error('Errore nel caricamento ordini', err)
    });
  }

  cambiaSezione(sezione: 'recensioni' | 'inventario' | 'spedizioni') {
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
    // Ora il CatalogoService gestisce autonomamente il token, quindi passiamo solo 2 argomenti
    this.catalogoService.aggiornaQuantita(id, nuovaQuantita).subscribe({
      next: () => {
        console.log('Scorte aggiornate con successo!');
        alert('Quantità aggiornata a magazzino!');
      },
      error: (err: any) => { 
        console.error('DETTAGLIO ERRORE SERVER:', err);
        alert('Errore durante il salvataggio. Controlla la console (F12).');
      }
    });
  }

  // --- GESTIONE SPEDIZIONI ---
  
  // Metodo per aggiornare lo stato di elaborazione/spedizione dell'ordine
  impostaStato(id: number, nuovoStato: string) {
    this.ordineService.aggiornaStatoOrdine(id, nuovoStato).subscribe({
      next: () => {
        console.log(`Stato dell'ordine #${id} aggiornato a: ${nuovoStato}`);
        alert(`Stato aggiornato a: ${nuovoStato}`);
        this.caricaDati(); // Ricarichiamo i dati per mostrare subito il nuovo stato in tabella
      },
      error: (err: any) => {
        console.error('Errore durante l\'aggiornamento dello stato', err);
        alert('Errore durante l\'aggiornamento dello stato dell\'ordine.');
      }
    });
  }
}