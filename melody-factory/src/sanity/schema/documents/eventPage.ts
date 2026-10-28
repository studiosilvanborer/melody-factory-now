import {defineField, defineType} from 'sanity'
// @sanity/icons liefert die Symbole ab v5 nur noch einzeln ueber Unterpfade.
import {CalendarIcon} from '@sanity/icons/Calendar'
import {DocumentVideoIcon} from '@sanity/icons/DocumentVideo'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {ImageIcon} from '@sanity/icons/Image'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {OlistIcon} from '@sanity/icons/Olist'
import {SearchIcon} from '@sanity/icons/Search'
import {TagIcon} from '@sanity/icons/Tag'
import {UsersIcon} from '@sanity/icons/Users'

/**
 * Die ganze Seite in einem Datensatz.
 *
 * Die Seite ist ein Einseiter. Alles auf mehrere Dokumente zu verteilen
 * wuerde den Kunden zum Suchen zwingen, ohne etwas zu gewinnen – also
 * steht alles hier, aufgeteilt in Reiter, die der Leserichtung der Seite
 * folgen: Hero, Veranstaltung, Intro, Zeit/Ort, Besetzung, Infos,
 * Trailer, Footer, Suchmaschinen.
 *
 * Eine Regel durchzieht das Schema: Datum, Ort und Ticket-Link stehen
 * genau einmal, im Reiter «Veranstaltung». Sie erscheinen auf der Seite
 * an drei Stellen (Hero, Zeit/Ort, Footer) – aber gepflegt werden sie an
 * einer. So kann das Datum nie an einer Stelle alt werden.
 */
export const eventPage = defineType({
  name: 'eventPage',
  title: 'NOW! – Seite',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', icon: ImageIcon, default: true},
    {name: 'event', title: 'Veranstaltung', icon: CalendarIcon},
    {name: 'intro', title: 'Intro', icon: TagIcon},
    {name: 'facts', title: 'Zeit / Ort', icon: OlistIcon},
    {name: 'cast', title: 'Besetzung', icon: UsersIcon},
    {name: 'infos', title: 'Infos', icon: InfoOutlineIcon},
    {name: 'trailer', title: 'Trailer', icon: DocumentVideoIcon},
    {name: 'footer', title: 'Footer', icon: EarthGlobeIcon},
    {name: 'newsletter', title: 'Newsletter', icon: EnvelopeIcon},
    {name: 'seo', title: 'Suchmaschinen & Social', icon: SearchIcon},
  ],

  fields: [
    /* ── Hero ──────────────────────────────────────────────────────── */
    defineField({
      name: 'heroImage',
      title: 'Hintergrundbild',
      type: 'image',
      group: 'hero',
      description:
        'Fuellt den ganzen ersten Bildschirm. Querformat, mindestens 2000 px breit. Der Bildausschnitt lässt sich unten über «Hotspot» festlegen – die Seite schneidet je nach Bildschirm unterschiedlich zu.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Bildbeschreibung',
          type: 'string',
          description:
            'Wird vorgelesen, wenn das Bild nicht angezeigt werden kann. Beschreibe, was zu sehen ist.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logoText',
      title: 'Wortmarke oben links',
      type: 'string',
      group: 'hero',
      initialValue: 'MELODY FACTORY',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'claimLine1',
      title: 'Claim, erste Zeile',
      type: 'string',
      group: 'hero',
      description: 'Steht links oben im Bild.',
      initialValue: 'Music you know.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'claimLine2',
      title: 'Claim, zweite Zeile',
      type: 'string',
      group: 'hero',
      initialValue: 'Goosebumps you don’t!',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'claimLanguage',
      title: 'Sprache des Claims',
      type: 'string',
      group: 'hero',
      description:
        'Nur fuer Vorleseprogramme. Bleibt «en», solange der Claim englisch ist.',
      options: {
        list: [
          {title: 'Englisch', value: 'en'},
          {title: 'Deutsch', value: 'de'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'calendarLabel',
      title: 'Schaltfläche oben rechts',
      type: 'string',
      group: 'hero',
      description:
        'Führt zur Terminliste unter /kalender. Leer lassen, und die Schaltfläche verschwindet.',
      initialValue: 'Kalender',
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: 'wordmark',
      title: 'Grosse Wortmarke',
      type: 'string',
      group: 'hero',
      description:
        'Die riesige Zeile unten im Bild. Kurz halten – sie wird auf die Spaltenbreite skaliert.',
      initialValue: 'NOW!',
      validation: (rule) => rule.required().max(12),
    }),

    /* ── Veranstaltung ─────────────────────────────────────────────── */
    defineField({
      name: 'startsAt',
      title: 'Datum und Beginn',
      type: 'datetime',
      group: 'event',
      description:
        'Einmal hier gesetzt, erscheint es im Hero, bei «Zeit / Ort» und im Ticket-Aufruf im Footer. Zeitzone ist Zürich.',
      options: {dateFormat: 'DD. MMMM YYYY', timeFormat: 'HH:mm', timeStep: 15},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venueShort',
      title: 'Ort, kurz',
      type: 'string',
      group: 'event',
      description: 'Fuer das Hero-Bild, wo der Platz knapp ist – z. B. «KKL, Auditorium».',
      initialValue: 'KKL, Auditorium',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'city',
      title: 'Stadt',
      type: 'string',
      group: 'event',
      initialValue: 'Luzern',
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: 'venueFull',
      title: 'Ort, ausgeschrieben',
      type: 'string',
      group: 'event',
      description: 'Fuer «Zeit / Ort» und den Footer – z. B. «KKL Luzern, Auditorium».',
      initialValue: 'KKL Luzern, Auditorium',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'duration',
      title: 'Dauer',
      type: 'string',
      group: 'event',
      initialValue: '1 Std. ohne Pause',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Weitere Informationen',
      type: 'text',
      rows: 3,
      group: 'event',
      description: 'Einlass, Rollstuhlplätze und Ähnliches. Erscheint unter «Zeit / Ort».',
      initialValue:
        'Einlass jeweils 60 Min. vor Vorstellungsbeginn. Rollstuhl und Begleitplätze online erhältlich.',
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket-Link',
      type: 'url',
      group: 'event',
      description: 'Hängt an beiden Ticket-Schaltflächen – im Hero und im Footer.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
      initialValue: 'https://www.kkl-luzern.ch/events/now-klassik-neu-erlebt',
    }),
    defineField({
      name: 'ticketLabel',
      title: 'Beschriftung der Ticket-Schaltfläche',
      type: 'string',
      group: 'event',
      initialValue: 'Tickets',
      validation: (rule) => rule.required().max(24),
    }),

    /* ── Intro ─────────────────────────────────────────────────────── */
    defineField({
      name: 'introTitle',
      title: 'Sektionstitel',
      type: 'string',
      group: 'intro',
      description: 'Die grosse Garamond-Zeile direkt unter dem Hero.',
      initialValue: 'Klassik neu erlebt.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'introLead',
      title: 'Lead',
      type: 'richText',
      group: 'intro',
      description:
        'Der zentrierte Absatz darunter. «Kursiv» setzt Komponistennamen hervor, so wie «Beethoven mit Beat».',
      validation: (rule) => rule.required(),
    }),

    /* ── Zeit / Ort ────────────────────────────────────────────────── */
    defineField({
      name: 'factsTitle',
      title: 'Spaltentitel',
      type: 'string',
      group: 'facts',
      initialValue: 'Zeit / Ort',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'labelDuration',
      title: 'Bezeichnung für die Dauer',
      type: 'string',
      group: 'facts',
      description: 'Der Wert dazu steht im Reiter «Veranstaltung».',
      initialValue: 'Dauer',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'labelVenue',
      title: 'Bezeichnung für den Ort',
      type: 'string',
      group: 'facts',
      initialValue: 'Ort',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'labelAdditionalInfo',
      title: 'Bezeichnung für die weiteren Informationen',
      type: 'string',
      group: 'facts',
      initialValue: 'Weitere Informationen',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'additionalFacts',
      title: 'Zusätzliche Angaben',
      type: 'array',
      group: 'facts',
      description:
        'Optional. Jede Angabe erscheint als weitere Zeile unter «Weitere Informationen» – etwa «Sprache» oder «Altersempfehlung».',
      of: [{type: 'fact'}],
    }),

    /* ── Besetzung ─────────────────────────────────────────────────── */
    defineField({
      name: 'castTitle',
      title: 'Spaltentitel',
      type: 'string',
      group: 'cast',
      initialValue: 'Besetzung',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'cast',
      title: 'Mitwirkende',
      type: 'array',
      group: 'cast',
      description:
        'Die Reihenfolge hier ist die Reihenfolge auf der Seite. Die Liste wird automatisch auf zwei Spalten verteilt – Einträge lassen sich einfach ziehen.',
      of: [{type: 'castMember'}],
      validation: (rule) => rule.min(1),
    }),

    /* ── Infos ─────────────────────────────────────────────────────── */
    defineField({
      name: 'infosTitle',
      title: 'Spaltentitel',
      type: 'string',
      group: 'infos',
      initialValue: 'Infos',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'infosText',
      title: 'Text',
      type: 'richText',
      group: 'infos',
      description:
        'Der lange Fliesstext. «Hervorgehoben» setzt die fetten Sätze, die sich mit den mageren abwechseln – dieser Wechsel ist der ganze Rhythmus des Textes.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'infosOutro',
      title: 'Schlusszeile',
      type: 'string',
      group: 'infos',
      description: 'Die hervorgehobene Zeile am Ende, z. B. «Wir sehen uns am 7. November!».',
      initialValue: 'Wir sehen uns am 7. November!',
      validation: (rule) => rule.max(120),
    }),

    /* ── Trailer ───────────────────────────────────────────────────── */
    defineField({
      name: 'trailerTitle',
      title: 'Spaltentitel',
      type: 'string',
      group: 'trailer',
      initialValue: 'Trailer',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'trailerVideo',
      title: 'Video-Datei',
      type: 'file',
      group: 'trailer',
      options: {accept: 'video/*'},
      description:
        'Direkt hochgeladenes Video, MP4. Hat Vorrang vor dem Link darunter – liegt hier eine Datei, wird sie gezeigt. Vorher komprimieren: unter 10 MB lädt es auch auf dem Handy flüssig.',
    }),
    defineField({
      name: 'trailerUrl',
      title: 'Video-Link',
      type: 'url',
      group: 'trailer',
      description:
        'YouTube- oder Vimeo-Adresse, als Alternative zur Datei oben. Sind beide Felder leer, zeigt die Seite den leeren Rahmen mit dem Hinweistext unten.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'trailerPlaceholder',
      title: 'Hinweis, solange kein Video hinterlegt ist',
      type: 'string',
      group: 'trailer',
      initialValue: 'Trailer zu NOW! – folgt in Kürze.',
      validation: (rule) => rule.max(120),
    }),

    /* ── Footer ────────────────────────────────────────────────────── */
    defineField({
      name: 'footerLinkColumns',
      title: 'Linkspalten',
      type: 'array',
      group: 'footer',
      description:
        'Links unten links, in Spalten. Drei Spalten mit je zwei Links entsprechen dem Entwurf.',
      of: [
        {
          type: 'object',
          name: 'linkColumn',
          title: 'Spalte',
          fields: [
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [{type: 'link'}],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {a: 'links.0.label', b: 'links.1.label'},
            prepare: ({a, b}: {a?: string; b?: string}) => ({
              title: [a, b].filter(Boolean).join(' · ') || 'Leere Spalte',
            }),
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Ticket-Aufruf',
      type: 'string',
      group: 'footer',
      description:
        'Die Garamond-Zeile rechts im Footer. Datum, Zeit und Ort darunter kommen aus «Veranstaltung».',
      initialValue: 'Hol dir jetzt Tickets!',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'footerWordmark',
      title: 'Grosse Wortmarke im Footer',
      type: 'string',
      group: 'footer',
      initialValue: 'Melody Factory',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'footerLegal',
      title: 'Rechtliche Zeile',
      type: 'string',
      group: 'footer',
      initialValue: '© 2026 Melody Factory. All rights reserved.',
      validation: (rule) => rule.required().max(120),
    }),

    /* ── Newsletter ────────────────────────────────────────────────── */
    /* Die drei Felder der Seite /newsletter. Sie steht fuer sich, damit
       der Link allein verschickt werden kann – und sie bringt dieselbe
       Anmeldung wie der Knopf im Footer, nur mit Platz fuer einen Satz
       darueber, warum man sie ausfuellen soll. */
    defineField({
      name: 'newsletterTitle',
      title: 'Titel der Seite',
      type: 'string',
      group: 'newsletter',
      description: 'Die Überschrift auf /newsletter – der Seite, deren Link man verschicken kann.',
      initialValue: 'Newsletter',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'newsletterLead',
      title: 'Text unter dem Titel',
      type: 'richText',
      group: 'newsletter',
      description:
        'Was im Newsletter steht und wie oft er kommt. Der Hinweis auf die Bestätigungsmail gehört hierher: MailerLite verschickt eine, bevor jemand eingetragen ist.',
    }),
    defineField({
      name: 'newsletterLabel',
      title: 'Beschriftung der Schaltfläche',
      type: 'string',
      group: 'newsletter',
      description:
        'Öffnet das Anmeldeformular von MailerLite – unten im Footer jeder Seite und auf /newsletter. Leer lassen, und der Knopf im Footer verschwindet; auf /newsletter steht dann «Newsletter abonnieren», weil die Seite ohne ihn zwecklos wäre.',
      initialValue: 'Newsletter abonnieren',
      validation: (rule) => rule.max(40),
    }),

    /* ── Suchmaschinen & Social ────────────────────────────────────── */
    defineField({
      name: 'metaTitle',
      title: 'Titel im Browser-Tab',
      type: 'string',
      group: 'seo',
      description: 'Auch die Zeile, die Google als Erstes zeigt. Rund 60 Zeichen.',
      initialValue: 'NOW! – Melody Factory, KKL Luzern',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Beschreibung für Suchmaschinen',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Der grau gesetzte Text unter dem Google-Treffer. Rund 155 Zeichen.',
      initialValue:
        'NOW! Music you know. Goosebumps you don’t! Melody Factory im KKL Luzern, Auditorium – 7. November 2026, 20:00 Uhr.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'shareTitle',
      title: 'Titel beim Teilen',
      type: 'string',
      group: 'seo',
      description:
        'Wird in WhatsApp, LinkedIn und Co. über der Vorschau angezeigt. Leer lassen übernimmt den Browser-Titel.',
      initialValue: 'NOW! – Klassik neu erlebt',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'shareDescription',
      title: 'Beschreibung beim Teilen',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Leer lassen übernimmt die Beschreibung für Suchmaschinen.',
      initialValue:
        'Beethoven mit Beat. Vivaldi mit Bass. Gershwin mit Gänsehaut. 7. November 2026, 20:00 Uhr, KKL Luzern, Auditorium.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'shareImage',
      title: 'Vorschaubild beim Teilen',
      type: 'image',
      group: 'seo',
      description:
        'Erscheint als Bild, wenn der Link geteilt wird. 1200 × 630 px. Leer lassen nimmt das Hero-Bild.',
    }),
  ],

  preview: {
    select: {title: 'metaTitle', media: 'heroImage'},
    prepare: ({title, media}: {title?: string; media?: unknown}) => ({
      title: title || 'NOW! – Seite',
      subtitle: 'Inhalte der Seite',
      media: media as never,
    }),
  },
})
