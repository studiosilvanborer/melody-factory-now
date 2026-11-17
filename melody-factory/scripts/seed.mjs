/**
 * Fuellt das Studio mit Startinhalten: der Seite (bisher index.html),
 * dem Kalender und der Gestaltung (bisher site.css und /public).
 *
 *   npm run seed              – legt an, was fehlt; ergaenzt bei
 *                               vorhandenen Datensaetzen die leeren Felder
 *   npm run seed -- --force   – ueberschreibt auch Vorhandenes
 *   npm run seed -- --dry-run – zeigt nur, was geschrieben wuerde
 *
 * Braucht SANITY_API_WRITE_TOKEN in .env.local (Rolle «Editor»).
 *
 * Ohne --force wird nie etwas ueberschrieben. Steht ein Datensatz schon
 * da, werden nur die Felder gesetzt, die in ihm noch fehlen
 * (setIfMissing) – so landen neue Felder im Studio, ohne dass ein
 * versehentliches `npm run seed` die gepflegten Texte auf den
 * Entwurfsstand zuruecksetzt.
 */
import {randomUUID} from 'node:crypto'
import {createReadStream, existsSync, readFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

loadEnv(resolve(root, '.env.local'))

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  exit('NEXT_PUBLIC_SANITY_PROJECT_ID und NEXT_PUBLIC_SANITY_DATASET muessen in .env.local stehen.')
}
const force = process.argv.includes('--force')
const dryRun = process.argv.includes('--dry-run')

if (!token && !dryRun) {
  exit(
    'SANITY_API_WRITE_TOKEN fehlt in .env.local.\n' +
      'Anlegen unter sanity.io/manage -> Projekt -> API -> Tokens, Rolle «Editor».',
  )
}
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-14',
  token,
  useCdn: false,
})

const DOC_ID = 'eventPage'
const CALENDAR_ID = 'calendarPage'
const SETTINGS_ID = 'siteSettings'

/* ── Hilfsmittel fuer Portable Text ───────────────────────────────── */

const key = () => randomUUID().slice(0, 12)

/** block('Text') oder block(['plain', ['strong', 'fett'], …]) */
function block(parts) {
  const spans = (Array.isArray(parts) ? parts : [parts]).map((part) =>
    typeof part === 'string'
      ? {_type: 'span', _key: key(), text: part, marks: []}
      : {_type: 'span', _key: key(), text: part[1], marks: [part[0]]},
  )
  return {_type: 'block', _key: key(), style: 'normal', markDefs: [], children: spans}
}

const withKeys = (items) => items.map((item) => ({_key: key(), ...item}))

/* ── Die Inhalte ──────────────────────────────────────────────────── */

const cast = [
  ['Violine', 'Julia Roshko'],
  ['Violine', 'Sára Zastko'],
  ['Viola', 'Leonardo Vezzadini'],
  ['Cello', 'Maura Rickenbach'],
  ['Trompete', 'Pietro Locati'],
  ['Waldhorn', 'Mauro García Flores'],
  ['Posaune', 'Giovanni Capelli'],
  ['Euphonium', 'Raúl Sabiote-Sánchez'],
  ['Keys', 'Alexandr Dudin'],
  ['E-Bass', 'Sophia Haas'],
  ['Schlagzeug', 'Jason Nordemann'],
  ['Moderator & Gesang', 'Tom Muster'],
  ['Moderatorin & Gesang', 'Raísa Ierone'],
].map(([role, name]) => ({_type: 'castMember', role, name}))

const footerLinkColumns = [
  [
    {label: 'Termine', href: '/kalender'},
    {label: 'Impressum', href: '#impressum'},
    {label: 'Datenschutz', href: '#datenschutz'},
  ],
  [
    {label: 'Kontakt', href: 'mailto:info@melodyfactory.ch'},
    {label: 'Newsletter', href: '/newsletter'},
  ],
  [
    {label: 'Instagram', href: 'https://www.instagram.com/'},
    {label: 'Youtube', href: 'https://www.youtube.com/'},
  ],
].map((links) => ({
  _type: 'linkColumn',
  links: withKeys(links.map((link) => ({_type: 'link', ...link}))),
}))

const content = {
  _id: DOC_ID,
  _type: 'eventPage',

  logoText: 'MELODY FACTORY',
  claimLine1: 'Music you know.',
  claimLine2: 'Goosebumps you don’t!',
  claimLanguage: 'en',
  calendarLabel: 'Kalender',
  wordmark: 'NOW!',

  // 7. November 2026, 20:00 Uhr in Luzern – im November gilt MEZ (UTC+1).
  startsAt: '2026-11-07T19:00:00.000Z',
  venueShort: 'KKL, Auditorium',
  city: 'Luzern',
  venueFull: 'KKL Luzern, Auditorium',
  duration: '1 Std. ohne Pause',
  additionalInfo:
    'Einlass jeweils 60 Min. vor Vorstellungsbeginn. Rollstuhl und Begleitplätze online erhältlich.',
  ticketUrl: 'https://www.kkl-luzern.ch/events/now-klassik-neu-erlebt',
  ticketLabel: 'Tickets',

  introTitle: 'Klassik neu erlebt.',
  introLead: [
    block([
      ['em', 'Beethoven'],
      ' mit Beat. ',
      ['em', 'Vivaldi'],
      ' mit Bass. ',
      ['em', 'Gershwin'],
      ' mit Gänsehaut.',
    ]),
    block(
      'Studierende der Hochschule Luzern bringen die bekanntesten Melodien der Musikgeschichte ins KKL, mit Schlagzeug und E-Bass. Erzählt wird die grösste Liebesgeschichte aller Zeiten: Romeo und Julia. Liebe, Drama und Herzschmerz, live auf der grossen Bühne.',
    ),
  ],

  factsTitle: 'Zeit / Ort',
  labelDuration: 'Dauer',
  labelVenue: 'Ort',
  labelAdditionalInfo: 'Weitere Informationen',
  additionalFacts: [],

  castTitle: 'Besetzung',
  cast: withKeys(cast),

  infosTitle: 'Infos',
  infosText: [
    block([
      ['strong', 'Musik, die du kennst. Gänsehaut, mit der du nicht rechnest.'],
      ' Licht aus. Bühne schwarz. ',
      ['strong', 'Dann: ein einziger Lichtstrahl. Schlagzeug. E-Bass. Trompete.'],
      ' Und noch so viel mehr, das im Dunkeln wartet. ',
      ['strong', 'Es geht los.'],
      ' Beethoven. Vivaldi. Gershwin. ',
      ['strong', 'Musik, die du zu kennen glaubst. Doch so hast du sie noch nie gehört.'],
      ' Und plötzlich geht jeder Ton unter die Haut. ',
      ['strong', 'Musik, Bewegung und Licht erzählen eine Geschichte.'],
      ' Von Liebe und Leidenschaft. Von Glück und Schmerz. ',
      [
        'strong',
        'Eine Geschichte, die dich mitreisst und dir das Herz bricht: Romeo und Julia.',
      ],
      ' Halte den Atem an. Folge der Musik.',
    ]),
  ],
  infosOutro: 'Wir sehen uns am 7. November!',

  trailerTitle: 'Trailer',
  trailerPlaceholder: 'Trailer zu NOW! – folgt in Kürze.',

  footerLinkColumns: withKeys(footerLinkColumns),
  ctaTitle: 'Hol dir jetzt Tickets!',
  footerWordmark: 'Melody Factory',
  footerLegal: '© 2026 Melody Factory. All rights reserved.',

  newsletterTitle: 'Newsletter',
  newsletterLead: [
    block(
      'Ein paar Mal im Jahr, wenn es etwas zu erzählen gibt: neue Termine, Blicke hinter die Bühne, Vorverkauf, bevor er öffentlich ist.',
    ),
    block(
      'Adresse eintragen, und wir schicken eine E-Mail zur Bestätigung – erst mit dem Klick darin bist du dabei. Abmelden geht jederzeit mit einem Klick.',
    ),
  ],
  newsletterLabel: 'Newsletter abonnieren',

  metaTitle: 'NOW! – Melody Factory, KKL Luzern',
  metaDescription:
    'NOW! Music you know. Goosebumps you don’t! Melody Factory im KKL Luzern, Auditorium – 7. November 2026, 20:00 Uhr.',
  shareTitle: 'NOW! – Klassik neu erlebt',
  shareDescription:
    'Beethoven mit Beat. Vivaldi mit Bass. Gershwin mit Gänsehaut. 7. November 2026, 20:00 Uhr, KKL Luzern, Auditorium.',
}

/* ── Der Kalender ─────────────────────────────────────────────────── */

/**
 * Vier Samstage als Startbestand, wie in der Skizze. Zeiten in UTC:
 * November bis Maerz ist MEZ (UTC+1), ab Ende Maerz MESZ (UTC+2) –
 * 20:00 Uhr in Luzern ist also mal 19:00Z, mal 18:00Z.
 *
 * Wochentag und Schreibweise der Uhrzeit stehen hier nicht: die
 * rechnet die Seite aus dem Datum.
 *
 * Nur der erste Termin hat einen Ticket-Link – fuer ihn laeuft der
 * Vorverkauf. Bei den uebrigen bleibt das Feld leer, und die Seite
 * zeigt die Schaltflaeche als blassen Umriss. Wer spaeter die Adresse
 * eintraegt, macht sie damit aktiv.
 */
const TICKET_URL = 'https://www.kkl-luzern.ch/events/now-klassik-neu-erlebt'

const calendar = {
  _id: CALENDAR_ID,
  _type: 'calendarPage',

  title: 'Kalender',
  entries: withKeys(
    [
      '2026-11-07T19:00:00.000Z',
      '2026-12-19T19:00:00.000Z',
      '2027-03-06T19:00:00.000Z',
      '2027-05-22T18:00:00.000Z',
    ].map((startsAt, index) => ({
      _type: 'calendarEntry',
      startsAt,
      venue: 'KKL Luzern',
      production: 'NOW!',
      ...(index === 0 ? {ticketUrl: TICKET_URL} : {}),
      ticketLabel: 'Tickets',
    })),
  ),
  emptyText: 'Neue Termine folgen in Kürze.',

  metaTitle: 'Kalender – Melody Factory',
  metaDescription:
    'Alle Termine der Melody Factory – Daten, Orte und Tickets auf einen Blick.',
}

/* ── Die Gestaltung ───────────────────────────────────────────────── */

/**
 * Was bisher nur im Code stand: die Farben aus site.css, die Schriften
 * aus dem Layout, der Bildausschnitt des Heros, die Breite des
 * Partnerlogos, die Saetze fuer Tastatur und Vorleseprogramme, die
 * beiden Kennungen von MailerLite.
 *
 * Dieselben Werte stehen als Rueckfall in src/sanity/design.ts – die
 * Seite laeuft also auch ohne diesen Datensatz. Hier landen sie, damit
 * sie im Studio sichtbar und aenderbar sind und nicht nur im Code.
 */
const settings = {
  _id: SETTINGS_ID,
  _type: 'siteSettings',

  accentColor: '#e4017e',
  inkColor: '#000000',
  hoverColor: '#ffffff',
  faviconLetter: 'N',

  showPartnerLogo: true,
  partnerLogoWidth: 98,
  partnerLogoWidthMobile: 140,

  fontSerif: '"EB Garamond", "Adobe Garamond Pro", Garamond, "Times New Roman", serif',
  fontSans: '"myriad-pro", "Myriad Pro", "Helvetica Neue", Arial, sans-serif',
  fontStylesheets: [
    'https://use.typekit.net/wgo3fee.css',
    'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap',
  ],

  heroFocusX: 50,
  heroFocusY: 28,
  heroFocusXMobile: 48,
  heroFocusYMobile: 20,
  heroScrim: 100,

  enableAnimations: true,
  enableParallax: true,

  skipLinkLabel: 'Zum Inhalt springen',
  footerNavLabel: 'Footer',
  newsletterNoscript: 'Für die Anmeldung muss JavaScript eingeschaltet sein.',
  calendarTicketContext: 'für {produktion} am {datum}',

  mailerliteAccountId: '2708824',
  mailerliteFormId: 'xbRCOL',
}

/* ── Los ──────────────────────────────────────────────────────────── */

if (dryRun) {
  const image = await findHeroImage()
  console.log(JSON.stringify({...content, heroImage: image ? `<Upload: ${image}>` : null}, null, 2))
  console.log(JSON.stringify(calendar, null, 2))
  const logo = findPartnerLogo()
  console.log(
    JSON.stringify({...settings, partnerLogo: logo ? `<Upload: ${logo}>` : null}, null, 2),
  )
  console.log(
    `\n${countBlocks(content.introLead)} Absatz/Absaetze im Lead, ` +
      `${countBlocks(content.infosText)} im Infos-Text, ` +
      `${content.cast.length} Mitwirkende, ` +
      `${content.footerLinkColumns.length} Linkspalten, ` +
      `${calendar.entries.length} Termine.`,
  )
  console.log('Probelauf – es wurde nichts geschrieben.')
  process.exit(0)
}

// Jeder Datensatz wird fuer sich geprueft: wer den Kalender nachtraegt,
// soll ihn anlegen koennen, ohne die gepflegte Startseite zu gefaehrden.
const [hasPage, hasCalendar, hasSettings] = await Promise.all([
  client.getDocument(DOC_ID).catch(() => null),
  client.getDocument(CALENDAR_ID).catch(() => null),
  client.getDocument(SETTINGS_ID).catch(() => null),
])

if (!hasPage || force) {
  const heroImage = await uploadHeroImage()
  if (heroImage) content.heroImage = heroImage
  await client.createOrReplace(content)
  console.log(
    `Der Datensatz «${DOC_ID}» steht${heroImage ? ' – mit Hero-Bild' : ' (ohne Hero-Bild)'}.`,
  )
} else {
  await fill(DOC_ID, content, hasPage)
}

if (!hasCalendar || force) {
  await client.createOrReplace(calendar)
  console.log(`Der Kalender «${CALENDAR_ID}» steht – mit ${calendar.entries.length} Terminen.`)
} else {
  await fill(CALENDAR_ID, calendar, hasCalendar)
}

// Das Partnerlogo wird nur hochgeladen, wenn der Datensatz neu entsteht
// oder das Feld noch leer ist: zweimal dieselbe Datei im Archiv hilft
// niemandem.
if (!hasSettings || force || !hasSettings.partnerLogo) {
  const partnerLogo = await uploadPartnerLogo()
  if (partnerLogo) settings.partnerLogo = partnerLogo
}

if (!hasSettings || force) {
  await client.createOrReplace(settings)
  console.log(
    `Die Gestaltung «${SETTINGS_ID}» steht${settings.partnerLogo ? ' – mit Partnerlogo' : ''}.`,
  )
} else {
  await fill(SETTINGS_ID, settings, hasSettings)
}

console.log('Zu sehen unter http://localhost:3000/studio')

/* ── Kleinteile ───────────────────────────────────────────────────── */

/**
 * Ergaenzt einen vorhandenen Datensatz um die Felder, die in ihm noch
 * fehlen – und ruehrt keines an, das schon einen Wert hat.
 *
 * Das ist der Normalfall nach dem ersten Lauf: das Schema bekommt ein
 * neues Feld, und der Entwurfswert soll im Studio ankommen, ohne dass die
 * gepflegten Texte daneben Schaden nehmen. setIfMissing kann das von
 * sich aus; geprueft wird es hier trotzdem noch einmal, damit in der
 * Ausgabe steht, was tatsaechlich dazukam.
 */
async function fill(id, draft, existing) {
  const missing = {}
  for (const [name, value] of Object.entries(draft)) {
    if (name.startsWith('_')) continue
    const current = existing[name]
    if (current === undefined || current === null) missing[name] = value
  }

  const names = Object.keys(missing)

  if (names.length === 0) {
    console.log(`«${id}» war vollstaendig – nichts ergaenzt.`)
    return
  }

  await client.patch(id).setIfMissing(missing).commit()
  console.log(`«${id}» ergaenzt um ${names.length} Feld(er): ${names.join(', ')}`)
}

/** Das Partnerlogo liegt als Datei in /public und wird von dort uebernommen. */
function findPartnerLogo() {
  const path = resolve(root, 'public', '3fach-logo.png')
  return existsSync(path) ? path : null
}

async function uploadPartnerLogo() {
  const file = findPartnerLogo()

  if (!file) {
    console.warn('public/3fach-logo.png nicht gefunden – das Logo-Feld bleibt leer.')
    return null
  }

  console.log(`Lade Partnerlogo hoch: ${file}`)
  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: '3fach-logo.png',
  })

  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: '3FACH',
  }
}

/** Das Bild liegt beim statischen Entwurf, eine Ebene ueber diesem Projekt. */
function findHeroImage() {
  const candidates = [resolve(root, '..', 'background.png'), resolve(root, 'background.png')]
  return candidates.find((path) => existsSync(path)) ?? null
}

function countBlocks(value) {
  return Array.isArray(value) ? value.length : 0
}

async function uploadHeroImage() {
  const file = findHeroImage()

  if (!file) {
    console.warn(
      'background.png nicht gefunden – der Datensatz entsteht ohne Hero-Bild.\n' +
        'Das Bild laesst sich im Studio nachtraeglich hochladen.',
    )
    return null
  }

  console.log(`Lade Hero-Bild hoch: ${file}`)
  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: 'background.png',
  })

  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: 'Zwei Musiker:innen der Melody Factory mit Tuba, Violine und Schlagzeug im dunklen Studiolicht',
  }
}

/** Minimaler .env-Leser – ein Paket dafuer waere hier Ueberbau. */
function loadEnv(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const [, name, raw] = match
    if (process.env[name]) continue
    process.env[name] = raw.replace(/^["']|["']$/g, '')
  }
}

function exit(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}
