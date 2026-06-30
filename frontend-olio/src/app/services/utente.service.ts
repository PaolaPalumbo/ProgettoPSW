import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs'; 
import { jwtDecode } from 'jwt-decode'; 
import { IndirizzoSpedizione } from '../models/indirizzo.spedizione';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8080/api/utenti';

  // <-- CORREZIONE: Inizializziamo il BehaviorSubject controllando se il token esiste DAVVERO
  private authSubject = new BehaviorSubject<boolean>(!!sessionStorage.getItem('token'));
  authStatus$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Metodo per la registrazione
  registrazione(nuovoUtente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrazione`, nuovoUtente);
  }
  
  // Metodo per il login
  login(credenziali: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenziali).pipe(
      tap((response: any) => {
        this.salvaSessione(response);
      })
    );
  }

  // Metodi di utility per gestire la sessione
  salvaSessione(response: any): void {
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('role', response.ruolo); 
    
    // Notifichiamo il resto dell'app che lo stato è cambiato
    this.authSubject.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    // Se il token è nullo, stringa vuota o "undefined", non siamo loggati
    // MODIFICATO: Metodo ora puro, non innesca reazioni a catena
    return token !== null && token !== undefined && token !== '' && token !== 'undefined';
  }

  // Logout
  logout(): void {
    // <-- CORREZIONE: Pulisci TUTTO in modo drastico
    sessionStorage.clear(); 
    
    // Notifichiamo il logout forzatamente a tutti i componenti in ascolto
    this.authSubject.next(false);
  }

  // SISTEMATO: Ora controlla prima il sessionStorage, poi il token crittografico
  hasRole(role: string): boolean {
    // 1. Controllo primario: leggiamo il ruolo che abbiamo salvato esplicitamente
    const ruoloSalvato = sessionStorage.getItem('role');
    if (ruoloSalvato && ruoloSalvato.toUpperCase() === role.toUpperCase()) {
      return true;
    }

    // 2. Fallback: proviamo a estrarlo dal token (se il backend dovesse iniziare a inviarlo)
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const ruoloNelToken = decoded.role || decoded.ruolo; 
      return ruoloNelToken === role;
    } catch (e) {
      console.error("Errore decodifica token", e);
      return false;
    }
  }

  // ---Metodo per eliminare l'account ---
  eliminaAccount(): Observable<any> {
    // La chiamata passerà automaticamente il token JWT grazie al tuo interceptor
    return this.http.delete(`${this.apiUrl}/elimina-account`);
  }

  /**
   * Salva un nuovo indirizzo di spedizione nella rubrica dell'utente
   * @param utenteId ID dell'utente loggato
   * @param nuovoIndirizzo Oggetto contenente i dati dell'indirizzo
   */
  aggiungiIndirizzoUtente(utenteId: number, nuovoIndirizzo: IndirizzoSpedizione): Observable<IndirizzoSpedizione> {
    return this.http.post<IndirizzoSpedizione>(`${this.apiUrl}/${utenteId}/indirizzi`, nuovoIndirizzo);
  }

  /**
   * Recupera la lista di tutti gli indirizzi salvati nella rubrica dell'utente
   * @param utenteId ID dell'utente loggato
   */
  getIndirizziUtente(utenteId: number): Observable<IndirizzoSpedizione[]> {
    return this.http.get<IndirizzoSpedizione[]>(`${this.apiUrl}/${utenteId}/indirizzi`);
  }

  // Aggiungi questo metodo nel tuo UtenteService
  eliminaIndirizzoUtente(idIndirizzo: number) {
    // Inseriamo la rotta speculare a come Spring Boot l'ha generata a causa del doppio "utenti"
    return this.http.delete(`http://localhost:8080/api/utenti/utenti/indirizzi/${idIndirizzo}`);
  }

}