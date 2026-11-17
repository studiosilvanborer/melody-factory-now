import {defineArrayMember, defineField, defineType} from 'sanity'
// @sanity/icons liefert die Symbole ab v5 nur noch einzeln ueber Unterpfade.
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'
import {CropIcon} from '@sanity/icons/Crop'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {ImagesIcon} from '@sanity/icons/Images'
import {PlayIcon} from '@sanity/icons/Play'
import {TextIcon} from '@sanity/icons/Text'

/**
 * Die Gestaltung der Seite in einem Datensatz.
 *
 * Bisher steckten diese Werte im Code: das Magenta in site.css, das
 * Partnerlogo als Datei in /public, der Bildausschnitt des Heros in einer
 * CSS-Regel, die Beschriftung der Sprungmarke im Layout. Alles davon ist
 * Gestaltung und kein Geheimnis – es gehoert dorthin, wo der Kunde auch
 * die Texte pflegt.
 *
 * Eine Regel durchzieht das Schema: jedes Feld darf leer bleiben. Was
 * leer ist, faellt auf den Entwurfswert zurueck (siehe
 * src/sanity/design.ts) – die Seite kann also nie dadurch kaputtgehen,
 * dass hier etwas fehlt. Wer das Magenta loescht, bekommt das Magenta des
 * Flyers zurueck, keine farblose Seite.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Gestaltung',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Farben', icon: ColorWheelIcon, default: true},
    {name: 'logos', title: 'Logos', icon: ImagesIcon},
    {name: 'type', title: 'Schrift', icon: TextIcon},
    {name: 'hero', title: 'Bildausschnitt', icon: CropIcon},
    {name: 'motion', title: 'Bewegung', icon: PlayIcon},
    {name: 'ui', title: 'Texte der Oberfläche', icon: BulbOutlineIcon},
    {name: 'newsletter', title: 'MailerLite', icon: EnvelopeIcon},
  ],

  fields: [
    /* ── Farben ────────────────────────────────────────────────────── */
    defineField({
      name: 'accentColor',
      title: 'Akzentfarbe (Magenta)',
      type: 'string',
      group: 'brand',
      description:
        'Die Farbe des Flyers. Sie traegt die ganze Seite: Schrift auf Schwarz, Flaeche im scrollenden Teil, Balken unter dem Hero, Pillen. Als Hex-Wert, z. B. #e4017e.',
      initialValue: '#e4017e',
      validation: (rule) => rule.custom(hexColor),
    }),
    defineField({
      name: 'inkColor',
      title: 'Grundfarbe (Schwarz)',
      type: 'string',
      group: 'brand',
      description:
        'Der Hintergrund von Hero und Footer – und die Schriftfarbe auf der magentafarbenen Flaeche. Hex-Wert.',
      initialValue: '#000000',
      validation: (rule) => rule.custom(hexColor),
    }),
    defineField({
      name: 'hoverColor',
      title: 'Farbe beim Überfahren',
      type: 'string',
      group: 'brand',
      description: 'Die Fuellung der Pillen, wenn die Maus darauf steht. Hex-Wert.',
      initialValue: '#ffffff',
      validation: (rule) => rule.custom(hexColor),
    }),
    defineField({
      name: 'faviconLetter',
      title: 'Buchstabe im Browser-Reiter',
      type: 'string',
      group: 'brand',
      description:
        'Das kleine Zeichen vor dem Seitentitel: ein Buchstabe in der Grundfarbe auf einem Feld in der Akzentfarbe. Leer lassen, und es bleibt beim «N».',
      initialValue: 'N',
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'faviconImage',
      title: 'Eigenes Zeichen im Browser-Reiter',
      type: 'image',
      group: 'brand',
      description:
        'Statt des Buchstabens. Quadratisch, 512 × 512 px, PNG oder SVG. Leer lassen, und der Buchstabe oben gilt.',
    }),

    /* ── Logos ─────────────────────────────────────────────────────── */
    defineField({
      name: 'partnerLogo',
      title: 'Partnerlogo',
      type: 'image',
      group: 'logos',
      description:
        'Die rechte obere Ecke, gegenüber der Wortmarke. Wichtig: die Datei muss selbst in der Akzentfarbe vorliegen, mit durchsichtigem Hintergrund – auf der magentafarbenen Fläche färbt die Seite sie schwarz um. Leer lassen, und es bleibt beim 3FACH-Logo aus dem Entwurf.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Bildbeschreibung',
          type: 'string',
          description: 'Der Name des Partners – wird vorgelesen und steht da, wenn das Bild fehlt.',
        }),
      ],
    }),
    defineField({
      name: 'showPartnerLogo',
      title: 'Partnerlogo zeigen',
      type: 'boolean',
      group: 'logos',
      description: 'Aus: die Ecke bleibt leer, auf allen Seiten.',
      initialValue: true,
    }),
    defineField({
      name: 'partnerLogoWidth',
      title: 'Breite am Bildschirm',
      type: 'number',
      group: 'logos',
      description:
        'In Entwurfs-Pixeln, bezogen auf das Raster 1440 × 1024 – die Seite skaliert von dort aus mit. 98 entspricht dem Entwurf.',
      initialValue: 98,
      validation: (rule) => rule.min(20).max(400),
    }),
    defineField({
      name: 'partnerLogoWidthMobile',
      title: 'Breite auf dem Handy',
      type: 'number',
      group: 'logos',
      description: 'Dieselbe Rechnung, nur fuer schmale Bildschirme. 140 entspricht dem Entwurf.',
      initialValue: 140,
      validation: (rule) => rule.min(20).max(400),
    }),

    /* ── Schrift ───────────────────────────────────────────────────── */
    defineField({
      name: 'fontSerif',
      title: 'Schrift der grossen Zeilen',
      type: 'string',
      group: 'type',
      description:
        'Wortmarke, Sektionstitel, Spaltentitel. Als Schriftenliste wie in CSS – zuerst die gewuenschte, danach Ersatzschriften. Leer lassen für EB Garamond.',
      initialValue: '"EB Garamond", "Adobe Garamond Pro", Garamond, "Times New Roman", serif',
    }),
    defineField({
      name: 'fontSans',
      title: 'Schrift des Fliesstextes',
      type: 'string',
      group: 'type',
      description: 'Alles Übrige. Leer lassen für Myriad Pro.',
      initialValue: '"myriad-pro", "Myriad Pro", "Helvetica Neue", Arial, sans-serif',
    }),
    defineField({
      name: 'fontStylesheets',
      title: 'Adressen der Webfonts',
      type: 'array',
      group: 'type',
      description:
        'Die Stylesheets, die die Schriften laden – Adobe Fonts (Typekit) und Google Fonts. Wer eine andere Schrift einsetzt, traegt hier deren Adresse ein. Leer lassen, und es bleibt bei den beiden des Entwurfs.',
      of: [defineArrayMember({type: 'url'})],
      validation: (rule) => rule.max(4),
    }),

    /* ── Bildausschnitt ────────────────────────────────────────────── */
    /* Der Hotspot am Hero-Bild sagt, was auf keinen Fall wegfallen darf.
       Diese vier Zahlen sagen, wo das Bild im Rahmen steht – zwei Dinge,
       die sich ergaenzen: 50 / 28 heisst «waagerecht mittig, senkrecht
       etwas oberhalb der Mitte». */
    defineField({
      name: 'heroFocusX',
      title: 'Hero-Bild · waagerecht',
      type: 'number',
      group: 'hero',
      description: '0 = linker Rand, 50 = Mitte, 100 = rechter Rand. Entwurf: 50.',
      initialValue: 50,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'heroFocusY',
      title: 'Hero-Bild · senkrecht',
      type: 'number',
      group: 'hero',
      description: '0 = Oberkante, 100 = Unterkante. Entwurf: 28.',
      initialValue: 28,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'heroFocusXMobile',
      title: 'Hero-Bild auf dem Handy · waagerecht',
      type: 'number',
      group: 'hero',
      description: 'Hochformat zeigt einen anderen Ausschnitt. Entwurf: 48.',
      initialValue: 48,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'heroFocusYMobile',
      title: 'Hero-Bild auf dem Handy · senkrecht',
      type: 'number',
      group: 'hero',
      description: 'Entwurf: 20.',
      initialValue: 20,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'heroScrim',
      title: 'Abdunklung über dem Bild',
      type: 'number',
      group: 'hero',
      description:
        'Der Verlauf, der die magentafarbene Schrift vom Foto abhebt – nur im unteren Teil des Heros. 100 = wie im Entwurf, 0 = ohne. Bei einem hellen Foto hilft mehr, bei einem dunklen weniger.',
      initialValue: 100,
      validation: (rule) => rule.min(0).max(200),
    }),

    /* ── Bewegung ──────────────────────────────────────────────────── */
    defineField({
      name: 'enableAnimations',
      title: 'Einblenden beim Scrollen',
      type: 'boolean',
      group: 'motion',
      description:
        'An: Zeilen und Blöcke steigen beim Laden und beim Scrollen auf. Aus: alles steht sofort. Wer im Betriebssystem «Bewegung reduzieren» eingestellt hat, sieht ohnehin nie eine Animation.',
      initialValue: true,
    }),
    defineField({
      name: 'enableParallax',
      title: 'Hero-Bild läuft dem Scrollen nachher',
      type: 'boolean',
      group: 'motion',
      description:
        'An: das Bild wandert beim Scrollen langsamer als die Seite, als läge es weiter hinten. Aus: es scrollt mit.',
      initialValue: true,
    }),

    /* ── Texte der Oberflaeche ─────────────────────────────────────── */
    /* Die Saetze, die niemand sieht, der sie nicht braucht: die
       Sprungmarke für die Tastatur, die Bezeichnung der Linkspalten für
       Vorleseprogramme, der Hinweis ohne JavaScript. Sie standen im Code,
       obwohl sie Text sind – und Text gehoert ins Studio. */
    defineField({
      name: 'skipLinkLabel',
      title: 'Sprungmarke zum Inhalt',
      type: 'string',
      group: 'ui',
      description:
        'Erscheint nur, wenn jemand mit der Tabulatortaste auf die Seite kommt: der erste Halt, der über den Hero hinweg zum Inhalt führt.',
      initialValue: 'Zum Inhalt springen',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'footerNavLabel',
      title: 'Bezeichnung der Linkspalten im Footer',
      type: 'string',
      group: 'ui',
      description:
        'Nur fuer Vorleseprogramme: so wird der Block mit den Links angesagt.',
      initialValue: 'Footer',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'newsletterNoscript',
      title: 'Hinweis ohne JavaScript',
      type: 'string',
      group: 'ui',
      description:
        'Steht auf /newsletter anstelle des Knopfes, wenn im Browser JavaScript aus ist – die Anmeldung von MailerLite braucht es.',
      initialValue: 'Für die Anmeldung muss JavaScript eingeschaltet sein.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'calendarTicketContext',
      title: 'Zusatz zur Ticket-Schaltfläche im Kalender',
      type: 'string',
      group: 'ui',
      description:
        'Nur fuer Vorleseprogramme: sechsmal «Tickets» untereinander sagt nichts, also wird der Termin mitgelesen. {produktion} und {datum} werden eingesetzt.',
      initialValue: 'für {produktion} am {datum}',
      validation: (rule) => rule.max(80),
    }),

    /* ── MailerLite ────────────────────────────────────────────────── */
    /* Zwei Kennungen aus dem MailerLite-Konto. Sie aendern sich nur, wenn
       dort ein neues Konto oder ein neues Formular entsteht – aber dann
       soll es ohne Deploy gehen. Leer heisst: die Werte aus dem Code. */
    defineField({
      name: 'mailerliteAccountId',
      title: 'Konto-Nummer',
      type: 'string',
      group: 'newsletter',
      description:
        'Aus dem Universal-Snippet im MailerLite-Konto, die Zahl in ml(\'account\', \'…\'). Leer lassen, und es bleibt bei der eingetragenen.',
      initialValue: '2708824',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'mailerliteFormId',
      title: 'Kennung des Anmeldeformulars',
      type: 'string',
      group: 'newsletter',
      description:
        'Das Pop-up-Formular, das der Knopf auf /newsletter öffnet. Leer lassen, und es bleibt beim eingetragenen.',
      initialValue: 'xbRCOL',
      validation: (rule) => rule.max(40),
    }),
  ],

  preview: {
    prepare: () => ({title: 'Gestaltung', subtitle: 'Farben, Logos, Schrift, Bewegung'}),
  },
})

/**
 * Hex-Werte, wie CSS sie versteht: #rgb, #rrggbb, #rrggbbaa. Leer ist
 * erlaubt – dann gilt der Entwurfswert.
 */
function hexColor(value: unknown): true | string {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Bitte einen Hex-Wert eintragen.'
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())
    ? true
    : 'Bitte als Hex-Wert schreiben, z. B. #e4017e.'
}
