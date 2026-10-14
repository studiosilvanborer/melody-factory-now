import type {
  CALENDAR_PAGE_QUERY_RESULT,
  EVENT_PAGE_QUERY_RESULT,
  RichText,
} from '../../sanity.types'

/**
 * Die Typen der Seite kommen aus dem Schema, nicht aus der Hand.
 *
 * `npm run typegen` liest das Schema und die GROQ-Abfragen und schreibt
 * sanity.types.ts. Wer ein Feld umbenennt und den Befehl laufen laesst,
 * bekommt den Fehler sofort in tsc – statt zur Laufzeit als leere Stelle
 * auf der Seite. Darum nur Verengungen hier, keine zweite Beschreibung.
 */

/** Die Inhalte der Seite, ohne den null-Fall (den faengt die Seite ab). */
export type EventPageData = NonNullable<EVENT_PAGE_QUERY_RESULT>

/** Die Inhalte des Kalenders, ohne den null-Fall. */
export type CalendarPageData = NonNullable<CALENDAR_PAGE_QUERY_RESULT>

/** Fliesstext, wie ihn das Schema liefert. */
export type RichTextValue = RichText

export type Fact = {label: string; value: string}
export type CastMember = NonNullable<EventPageData['cast']>[number]
export type CalendarEntry = NonNullable<CalendarPageData['entries']>[number]
export type FooterLink = NonNullable<
  NonNullable<EventPageData['footerLinkColumns']>[number]['links']
>[number]
