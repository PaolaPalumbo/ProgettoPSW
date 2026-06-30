import { Utente } from './utente.model'; 

export interface IndirizzoSpedizione {
  id?: number; // Opzionale perché quando creo un nuovo indirizzo l'ID lo assegna il DB
  indirizzoSpedizione: string;
  citta: string;
  cap: string;
  nomeIndirizzo: string; // Es. "Casa", "Lavoro"
  utente?: Utente; // Opzionale, spesso lato frontend basta passare l'ID nell'URL dell'endpoint
}