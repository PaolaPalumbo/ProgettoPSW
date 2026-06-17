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

  
  login(credenziali: any): Observable<any> {
    // Aggiungiamo { responseType: 'text' } per accettare la stringa pura da Spring Boot
    return this.http.post(`${this.apiUrl}/login`, credenziali, { responseType: 'text' }).pipe(
      tap((tokenStr: any) => {
        // Ora il backend ci restituisce direttamente la stringa, la salviamo e basta!
        this.salvaToken(tokenStr);
      })
    );
  }

  salvaToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}