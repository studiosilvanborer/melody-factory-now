/**
 * Die beiden Angaben aus dem MailerLite-Konto, an einer Stelle.
 *
 * Bewusst im Code und nicht im Studio: beides sind technische Kennungen
 * aus dem MailerLite-Backend, die sich nur aendern, wenn dort ein neues
 * Konto oder ein neues Formular angelegt wird. Im Studio waeren sie eine
 * Stolperstelle ohne Gewinn – was der Kunde wirklich pflegt, ist die
 * Beschriftung der Schaltflaeche, und die steht im Reiter «Footer».
 */

/** Konto-ID aus dem Universal-Snippet. */
export const MAILERLITE_ACCOUNT_ID = '2708824'

/** Das Formular, das die Schaltflaeche im Footer oeffnet. */
export const MAILERLITE_FORM_ID = 'xbRCOL'

declare global {
  interface Window {
    /** Legt das Universal-Snippet an; davor sammelt es die Aufrufe. */
    ml?: (command: string, ...args: unknown[]) => void
  }
}
