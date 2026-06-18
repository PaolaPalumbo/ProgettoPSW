import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  ordini: any[] = [];
  caricamento: boolean = true;

  private adminUrl = 'http://localhost:8080/api/admin/ordini';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.caricaOrdini();
  }

  // Io recupero tutti gli ordini dal backend
  caricaOrdini() {
    this.caricamento = true;
    this.http.get<any[]>(this.adminUrl).subscribe({
      next: (data) => {
        this.ordini = data;
        this.caricamento = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento ordini admin:', err);
        this.caricamento = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Io aggiorno lo stato di un ordine specifico
  aggiornaStato(id: number, nuovoStato: string) {
    this.http.post(`${this.adminUrl}/aggiorna-stato/${id}`, nuovoStato).subscribe({
      next: () => {
        console.log('Stato aggiornato con successo');
        this.caricaOrdini(); // Ricarico la tabella per vedere il cambiamento
      },
      error: (err) => console.error('Errore aggiornamento:', err)
    });
  }
}