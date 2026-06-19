import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarrelloService } from '../services/carrello.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'checkout.html',
  styleUrl: './checkout.css' // Assicurati che questo file esista, altrimenti rimuovi la riga
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private carrelloService: CarrelloService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      indirizzoSpedizione: ['', Validators.required],
      citta: ['', Validators.required],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  ngOnInit(): void {}

  confermaOrdine() {
    if (this.checkoutForm.valid) {
      // Recupero i prodotti dal servizio (il Singleton che mantiene lo stato)
      // 1. Mappa correttamente i prodotti in un array di oggetti
      const prodotti = this.carrelloService.getArticoli().map((p: any) => ({
        idProdotto: p.id,
        quantita: 1
        }));
        // 2. Il payload DEVE corrispondere ai campi del nuovo CheckoutDTO.java
      const payload = {
        prodotti: prodotti,
        indirizzoSpedizione: this.checkoutForm.value.indirizzoSpedizione,
        citta: this.checkoutForm.value.citta,
        cap: this.checkoutForm.value.cap
      };

      // Invio al backend tramite il CarrelloService 
      this.carrelloService.effettuaCheckout(payload).subscribe({
        next: () => {
          alert("Ordine registrato con successo!");
          this.carrelloService.svuotaCarrello();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error("Dettaglio errore 400:", err.error);
          alert("Errore durante l'ordine: " + (err.error?.message || err.message || 'Errore sconosciuto'));
        }
      });
    }
  }
}