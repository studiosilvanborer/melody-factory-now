/**
 * Die beiden Angaben aus dem MailerLite-Konto, an einer Stelle.
 *
 * Es sind technische Kennungen aus dem MailerLite-Backend; sie aendern
 * sich nur, wenn dort ein neues Konto oder ein neues Formular entsteht.
 * Darum stehen sie hier als die Werte, die gelten, solange niemand etwas
 * anderes verlangt – und im Studio, Datensatz «Gestaltung», Reiter
 * «MailerLite», als Felder, die sie ueberschreiben. So braucht ein
 * Wechsel im MailerLite-Konto keinen Deploy, und ein leeres Feld im
 * Studio macht die Anmeldung trotzdem nicht kaputt.
 */

/** Konto-ID aus dem Universal-Snippet. */
export const MAILERLITE_ACCOUNT_ID = '2708824'

/**
 * Das Formular, das der Knopf auf /newsletter oeffnet – und das dort
 * nach fuenf Sekunden auch von allein kommt. Ein Pop-up-Formular: MailerLite zeigt es ueber der Seite
 * an, nicht in ihr. Soll es eines Tages fest in der Seite stehen, braucht
 * es im MailerLite-Konto ein Formular vom Typ «Embedded» und hier ein
 * <div className="ml-embedded" data-form="…"> – universal.js fuellt es
 * dann selbst. Nur: das Pop-up pflegt der Kunde schon, und zwei
 * Formulare fuer dieselbe Anmeldung waeren eine Fehlerquelle mehr.
 */
export const MAILERLITE_FORM_ID = 'xbRCOL'

declare global {
  interface Window {
    /** Legt das Universal-Snippet an; davor sammelt es die Aufrufe. */
    ml?: (command: string, ...args: unknown[]) => void
  }
}
