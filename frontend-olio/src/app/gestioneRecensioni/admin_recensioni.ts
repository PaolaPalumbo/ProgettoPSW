import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecensioneService } from '../services/recensione.service';
import { Recensione } from '../models/recensione.model';

@Component({
  selector: 'app-admin-recensioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin_recensioni.html',
  styleUrl: './admin_recensioni.css',
})
export class AdminRecensioniComponent implements OnInit {
  
  recensioniInSospeso: Recensione[] = [];

  constructor(private recensioneService: RecensioneService) {}

  ngOnInit(): void {
    this.caricaRecensioniDaApprovare();
  }

  caricaRecensioniDaApprovare() {
    this.recensioneService.getRecensioniDaApprovare().subscribe({
      next: (dati) => {
        this.recensioniInSospeso = dati;
      },
      error: (errore) => {
        console.error("Errore nel recupero delle recensioni in sospeso:", errore);
      }
    });
  }

 approva(recensione: Recensione) {
    // Utilizzo l'operatore di non-nullità (!) per aggirare lo Strict Mode
    this.recensioneService.approva(recensione.id!).subscribe({
      next: () => {
        alert('Recensione approvata e ora visibile nel catalogo pubblico!');
        // Rimuove dinamicamente la recensione appena approvata dall'interfaccia admin
        this.recensioniInSospeso = this.recensioniInSospeso.filter(r => r.id !== recensione.id);
      },
      error: (errore) => {
        console.error("Errore durante l'approvazione:", errore);
        alert("Ops! Qualcosa è andato storto nell'approvazione.");
      }
    });
  }
  
}