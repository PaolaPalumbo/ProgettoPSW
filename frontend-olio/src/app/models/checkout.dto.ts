export interface CheckoutDTO {
  prodottoId: number;
  quantita: number;
  // L'ID utente non lo passiamo qui per sicurezza: il backend lo estrarrà in automatico 
  // dal token JWT che l'AuthInterceptor inserisce nell'header!
}