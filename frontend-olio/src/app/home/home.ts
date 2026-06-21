import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  constructor() { }

  ngOnInit(): void {
    // Componente di narrazione iniziale
  }

  ngAfterViewInit(): void {
    // Configurazione dell'IntersectionObserver per l'effetto di scorrimento a cascata
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Quando la sezione entra nel viewport, aggiungiamo la classe 'active'
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { 
      threshold: 0.2 // L'effetto scatta quando il 20% della sezione è visibile
    });

    // Osserviamo tutti gli elementi che hanno la classe .reveal-section
    document.querySelectorAll('.reveal-section').forEach(section => {
      observer.observe(section);
    });
  }
}