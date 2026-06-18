import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8080/api/utenti';

  constructor(private http: HttpClient) {}

  // Metodo per la registrazione
  registrazione(nuovoUtente: any): Observable<any> {
    // Il backend per la registrazione restituisce l'oggetto JSON dell'utente salvato
    return this.http.post(`${this.apiUrl}/registrazione`, nuovoUtente);
  }
  
  // Metodo per il login
  login(credenziali: any): Observable<any> {
    // Aggiungo { responseType: 'text' } per accettare la stringa pura del JWT da Spring Boot
    return this.http.post(`${this.apiUrl}/login`, credenziali, { responseType: 'text' }).pipe(
      tap((tokenStr: any) => {
        // Ora il backend mi restituisce direttamente la stringa, la salvo e basta!
        this.salvaToken(tokenStr);
      })
    );
  }

  // Metodi di utility per gestire la mia sessione nel browser
  salvaToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Questo è il metodo che uso nella Navbar per capire se mostrare "Accedi" o "Area Personale"
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Metodo per uscire: cancello il token e chiudo la sessione
  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}