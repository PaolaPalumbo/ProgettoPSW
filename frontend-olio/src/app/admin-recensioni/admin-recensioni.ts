import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecensioneService } from '../services/recensione.service';
import { Recensione } from '../models/recensione.model'; 

@Component({
  selector: 'app-admin-recensioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-recensioni.html',
  styleUrl: './admin-recensioni.css'
})
export class AdminRecensioniComponent implements OnInit {
  
  recensioniInSospeso: Recensione[] = [];

  constructor(
    private recensioneService: RecensioneService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.caricaRecensioni();
  }

  // Metodo per chiedere a Spring Boot la lista delle recensioni bloccate
  caricaRecensioni() {
    this.recensioneService.getRecensioniInAttesa().subscribe({ // <-- Aggiornato il nome del metodo
      next: (dati: any) => { // <-- Tipizzato con : any
        console.log("DATI IN INGRESSO DAL BACKEND:", dati);
        this.recensioniInSospeso = [...dati]; 
        // Forza l'aggiornamento della vista dopo il caricamento asincrono
        this.cdRef.detectChanges();
      },
      error: (errore: any) => console.error('Errore nel caricamento', errore) // <-- Tipizzato con : any
    });
  }

  // CORRETTO: Adattato per ricevere l'intero oggetto come richiede il tuo HTML
  approva(recensione: Recensione) {
    // CORRETTO: Il metodo corretto nel service si chiama "approva"
    this.recensioneService.approva(recensione.id!).subscribe({
      next: () => {
        alert('Recensione approvata e pubblicata con successo!');
        // Aggiorno la lista a schermo rimuovendo quella appena approvata
        this.recensioniInSospeso = this.recensioniInSospeso.filter(r => r.id !== recensione.id);
      },
      error: (errore: any) => { // <-- Tipizzato con : any
        console.error("Errore durante l'approvazione", errore);
        alert("Ops! Qualcosa è andato storto.");
      }
    });
  }
}