import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecensioneService } from '../services/recensione.service';
// Assicurati che il percorso di importazione del modello sia corretto:
import { Recensione } from '../models/recensione.model'; 

@Component({
  selector: 'app-admin-recensioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-recensioni.html',
  styleUrl: './admin-recensioni.css'
})
export class AdminRecensioniComponent implements OnInit {
  
  recensioniInAttesa: Recensione[] = [];

  constructor(private recensioneService: RecensioneService) {}

  ngOnInit(): void {
    this.caricaRecensioni();
  }

  // Metodo per chiedere a Spring Boot la lista delle recensioni bloccate
  caricaRecensioni() {
    this.recensioneService.getRecensioniDaApprovare().subscribe({
      next: (dati) => {
        this.recensioniInAttesa = dati;
      },
      error: (errore) => console.error('Errore nel caricamento delle recensioni da approvare', errore)
    });
  }

  // Metodo per approvare e far sparire la recensione dalla lista
  approva(id: number) {
    this.recensioneService.approvaRecensione(id).subscribe({
      next: () => {
        alert('Recensione approvata e pubblicata con successo!');
        // Aggiorniamo la lista a schermo rimuovendo quella appena approvata
        this.recensioniInAttesa = this.recensioniInAttesa.filter(r => r.id !== id);
      },
      error: (errore) => {
        console.error("Errore durante l'approvazione", errore);
        alert("Ops! Qualcosa è andato storto.");
      }
    });
  }
}