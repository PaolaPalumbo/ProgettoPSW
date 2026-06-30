import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // AGGIUNTO: Import del ChangeDetectorRef
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // AGGIUNTO: Import per l'uso delle direttive strutturali nell'HTML standalone
import { CarrelloService } from '../services/carrello.service';
import { UtenteService } from '../services/utente.service'; // AGGIUNTO: Import per recuperare gli indirizzi dell'utente loggato
import { Router } from '@angular/router';
import { IndirizzoSpedizione } from '../models/indirizzo.spedizione';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // AGGIUNTO: CommonModule inserito negli imports
  templateUrl: 'checkout.html',
  styleUrl: './checkout.css' 
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  listaIndirizzi: IndirizzoSpedizione[] = []; // AGGIUNTO: Contenitore per gli indirizzi recuperati dal DB

  constructor(
    private fb: FormBuilder,
    private carrelloService: CarrelloService,
    private utenteService: UtenteService, // AGGIUNTO: Iniezione del servizio utente
    private router: Router,
    private cdr: ChangeDetectorRef // AGGIUNTO: Iniezione del ChangeDetector per forzare il render
  ) {
    this.checkoutForm = this.fb.group({
      indirizzoSelezionato: [''], // AGGIUNTO: Campo di controllo per tracciare la selezione del menu a tendina
      indirizzoSpedizione: ['', Validators.required],
      citta: ['', Validators.required],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  ngOnInit(): void {
    console.log("--- DEBUG CHECKOUT ---");
    // Recupero le informazioni sulla sessione dell'utente dal localStorage
    const utenteLoggato = localStorage.getItem('utente');
    console.log("Contenuto di localStorage.getItem('utente'):", utenteLoggato);
    
    if (utenteLoggato) {
      const utenteOggetto = JSON.parse(utenteLoggato);
      console.log("Oggetto utente parsato:", utenteOggetto);
      
      const utenteId = utenteOggetto.id;
      console.log("ID Utente estratto:", utenteId);

      if (!utenteId) {
        console.error("ATTENZIONE: L'id dell'utente è undefined o null nel localStorage!");
      }

      console.log("Lancio la chiamata HTTP verso il backend per l'ID:", utenteId);
      // Invoco il servizio per ottenere tutti gli indirizzi salvati nel suo profilo
      this.utenteService.getIndirizziUtente(utenteId).subscribe({
        next: (indirizzi) => {
          console.log("Risposta backend ricevuta. Array indirizzi:", indirizzi);
          this.listaIndirizzi = indirizzi;
          console.log("Lunghezza listaIndirizzi attuale:", this.listaIndirizzi.length);
          
          // AGGIUNTO: Forza Angular ad aggiornare l'HTML istantaneamente!
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error("Errore nel caricamento della rubrica indirizzi:", err)
      });
    } else {
      console.warn("Nessun utente trovato nel localStorage. Salto la chiamata HTTP.");
    }

    // Resto in ascolto sui cambiamenti della select: precompilo i campi se viene scelto un indirizzo esistente
    this.checkoutForm.get('indirizzoSelezionato')?.valueChanges.subscribe(idSelezionato => {
      if (idSelezionato) {
        const indirizzoTrovato = this.listaIndirizzi.find(ind => ind.id === +idSelezionato);
        if (indirizzoTrovato) {
          this.checkoutForm.patchValue({
            indirizzoSpedizione: indirizzoTrovato.indirizzoSpedizione,
            citta: indirizzoTrovato.citta,
            cap: indirizzoTrovato.cap
          });
        }
      } else {
        // Se l'utente seleziona l'inserimento di un nuovo indirizzo, svuoto i campi del form
        this.checkoutForm.patchValue({
          indirizzoSpedizione: '',
          citta: '',
          cap: ''
        });
      }
    });
  }

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
          
          // Gestione dinamica del popup: legge la stringa diretta del backend o l'oggetto d'errore standard
          let messaggioPersonalizzato = "Errore durante l'ordine: ";
          if (err.error && typeof err.error === 'string') {
            messaggioPersonalizzato += err.error;
          } else if (err.error && err.error.message) {
            messaggioPersonalizzato += err.error.message;
          } else {
            messaggioPersonalizzato += (err.message || 'Errore sconosciuto');
          }
          
          alert(messaggioPersonalizzato);
        }
      });
    }
  }
}