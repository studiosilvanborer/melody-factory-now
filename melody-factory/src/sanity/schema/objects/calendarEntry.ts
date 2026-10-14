import {defineField, defineType} from 'sanity'

/**
 * Eine Zeile im Kalender: Datum, Ort, Produktion, Ticket-Link.
 *
 * Der Wochentag wird nicht gepflegt, sondern aus dem Datum gerechnet –
 * er kann so nie zum Datum danebenstehen. Dasselbe gilt fuer die
 * Schreibweise der Uhrzeit: einmal im Code festgelegt, ueberall gleich.
 *
 * Die Reihenfolge der Liste ist die Reihenfolge auf der Seite. Wer
 * einen Termin nachtraegt, zieht ihn an die richtige Stelle.
 */
export const calendarEntry = defineType({
  name: 'calendarEntry',
  title: 'Termin',
  type: 'object',
  fields: [
    defineField({
      name: 'startsAt',
      title: 'Datum und Beginn',
      type: 'datetime',
      description: 'Wochentag und Uhrzeit entstehen daraus. Zeitzone ist Zürich.',
      options: {dateFormat: 'DD. MMMM YYYY', timeFormat: 'HH:mm', timeStep: 15},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Ort',
      type: 'string',
      description: 'Die dünne Zeile in der Mitte – z. B. «KKL Luzern».',
      initialValue: 'KKL Luzern',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'production',
      title: 'Produktion',
      type: 'string',
      description: 'Die fette Zeile darunter – z. B. «NOW!».',
      initialValue: 'NOW!',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket-Link',
      type: 'url',
      description:
        'Solange hier nichts steht, ist die Schaltfläche grau und nicht anklickbar. Sobald der Vorverkauf steht, Adresse eintragen – die Schaltfläche wird von selbst aktiv.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'ticketLabel',
      title: 'Beschriftung der Schaltfläche',
      type: 'string',
      description: 'Steht am rechten Rand der Zeile – «Tickets», «Restkarten», «Abendkasse».',
      initialValue: 'Tickets',
      validation: (rule) => rule.required().max(24),
    }),
  ],
  preview: {
    select: {startsAt: 'startsAt', venue: 'venue', production: 'production'},
    prepare: ({
      startsAt,
      venue,
      production,
    }: {
      startsAt?: string
      venue?: string
      production?: string
    }) => ({
      title: startsAt ? previewDate(startsAt) : 'Ohne Datum',
      subtitle: [production, venue].filter(Boolean).join(' · '),
    }),
  },
})

/** «Sa, 7. November 2026, 20:00» – nur fuer die Liste im Studio. */
function previewDate(iso: string): string {
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Zurich',
  }).format(new Date(iso))
}
