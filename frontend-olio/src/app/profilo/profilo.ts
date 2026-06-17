import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profilo.html',
  styleUrls: ['./profilo.css']
})
export class ProfiloComponent implements OnInit {
  ordini: any[] = [];
  caricamento: boolean = true;
  messaggioErrore: string = '';

  // Assicurati che l'URL corrisponda esattamente a quello del tuo controller Spring Boot
  private apiUrl = 'http://localhost:8080/api/ordini/miei'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.caricaOrdini();
  }

  caricaOrdini() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.ordini = data;
        this.caricamento = false;
      },
      error: (err) => {
        this.messaggioErrore = 'Non è stato possibile caricare gli ordini. Riprova più tardi.';
        this.caricamento = false;
      }
    });
  }
}