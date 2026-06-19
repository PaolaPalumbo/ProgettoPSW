import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs'; // <-- Importato BehaviorSubject
import { jwtDecode } from 'jwt-decode'; // Importa la libreria

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8080/api/utenti';

  // <-- Nuova logica per notificare in tempo reale il cambio di stato dell'autenticazione
  private authSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Metodo per la registrazione
  registrazione(nuovoUtente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrazione`, nuovoUtente);
  }
  
  // Metodo per il login
  login(credenziali: any): Observable<any> {
    // RIMOSSO { responseType: 'text' } per ricevere l'oggetto JSON completo
    return this.http.post(`${this.apiUrl}/login`, credenziali).pipe(
      tap((response: any) => {
        // Ora response è l'oggetto { token: "...", ruolo: "..." }
        this.salvaSessione(response);
      })
    );
  }

  // Metodi di utility per gestire la sessione
  salvaSessione(response: any): void {
    localStorage.setItem('token', response.token);
    // Nota: Il ruolo è ora dentro il token, non serve più salvarlo come stringa separata,
    // ma manteniamo la riga per compatibilità se il tuo codice lo usa ancora altrove.
    localStorage.setItem('role', response.ruolo); 
    
    // <-- Notifichiamo il resto dell'app che lo stato è cambiato
    this.authSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Puliamo tutto
    
    // <-- Notifichiamo il logout
    this.authSubject.next(false);
  }

  // SISTEMATO: Ora estrae il ruolo direttamente dal token crittografico
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      // Estrae il ruolo dal token; se il backend invia 'ruolo', cambialo qui
      const ruoloNelToken = decoded.role || decoded.ruolo; 
      return ruoloNelToken === role;
    } catch (e) {
      console.error("Errore decodifica token", e);
      return false;
    }
  }
}