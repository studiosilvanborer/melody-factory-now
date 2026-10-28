/**
 * Die beiden Angaben aus dem MailerLite-Konto, an einer Stelle.
 *
 * Bewusst im Code und nicht im Studio: beides sind technische Kennungen
 * aus dem MailerLite-Backend, die sich nur aendern, wenn dort ein neues
 * Konto oder ein neues Formular angelegt wird. Im Studio waeren sie eine
 * Stolperstelle ohne Gewinn – was der Kunde wirklich pflegt, ist die
 * Beschriftung der Schaltflaeche, und die steht im Reiter «Newsletter».
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
