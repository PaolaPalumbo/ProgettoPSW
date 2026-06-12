import { Utente } from './utente.model';
import { Prodotto } from './prodotto.model';

export interface Recensione {
    id?: number;
    voto: number;
    commento: string;
    approvata?: boolean;
    utente: Utente;
    prodotto: Prodotto;
}