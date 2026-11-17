import {MAILERLITE_ACCOUNT_ID, MAILERLITE_FORM_ID} from '@/lib/mailerlite'

import {urlFor} from './image'
import type {SiteSettingsData} from './types'

/**
 * Die Gestaltung aus dem Studio, zu Ende gedacht.
 *
 * Zwei Dinge passieren hier, und nur hier:
 *
 *  1. Jedes leere Feld bekommt seinen Entwurfswert. Die Seite muss auch
 *     ohne den Datensatz «Gestaltung» stehen – vor dem ersten Speichern,
 *     und nachdem jemand ein Feld geleert hat. Darum sind die Werte des
 *     Entwurfs hier doppelt vorhanden: als initialValue im Schema, damit
 *     das Formular nicht leer aussieht, und als Rueckfall hier, damit die
 *     Seite nie von einem fehlenden Wert abhaengt.
 *
 *  2. Aus den Werten wird CSS. Die Seite ist in site.css ueber
 *     Custom Properties gebaut – --pink, --black, --hero-focus und so
 *     weiter. Was im Studio steht, ueberschreibt genau diese Properties,
 *     nichts weiter. Es gibt deshalb keine zweite Gestaltung neben der
 *     im Stylesheet, nur andere Zahlen in derselben.
 */

/** Die Werte des Entwurfs – gemessen am Flyer, abgelesen aus site.css. */
export const DESIGN_DEFAULTS = {
  accent: '#e4017e',
  ink: '#000000',
  hover: '#ffffff',
  faviconLetter: 'N',
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
  animations: true,
  parallax: true,
  partnerLogo: {
    show: true,
    src: '/3fach-logo.png',
    alt: '3FACH',
    width: 673,
    height: 300,
    columnWidth: 98,
    columnWidthMobile: 140,
  },
  skipLinkLabel: 'Zum Inhalt springen',
  footerNavLabel: 'Footer',
  newsletterNoscript: 'Für die Anmeldung muss JavaScript eingeschaltet sein.',
  calendarTicketContext: 'für {produktion} am {datum}',
  /** Konto und Formular aus dem MailerLite-Konto, siehe lib/mailerlite.ts. */
  mailerliteAccountId: MAILERLITE_ACCOUNT_ID,
  mailerliteFormId: MAILERLITE_FORM_ID,
} as const

export type Design = {
  accent: string
  ink: string
  hover: string
  fontSerif: string
  fontSans: string
  fontStylesheets: string[]
  heroFocus: string
  heroFocusMobile: string
  heroScrim: number
  animations: boolean
  parallax: boolean
  partnerLogo: {
    show: boolean
    src: string
    alt: string
    width: number
    height: number
    columnWidth: number
    columnWidthMobile: number
  }
  faviconUrl: string
  skipLinkLabel: string
  footerNavLabel: string
  newsletterNoscript: string
  calendarTicketContext: string
  mailerliteAccountId: string
  mailerliteFormId: string
}

/** Aus dem Datensatz (oder aus nichts) ein vollstaendiger Satz Werte. */
export function resolveDesign(settings: SiteSettingsData | null | undefined): Design {
  const d = DESIGN_DEFAULTS

  const accent = text(settings?.accentColor) ?? d.accent
  const ink = text(settings?.inkColor) ?? d.ink

  const stylesheets = (settings?.fontStylesheets ?? [])
    .map((url) => text(url))
    .filter((url): url is string => Boolean(url))

  return {
    accent,
    ink,
    hover: text(settings?.hoverColor) ?? d.hover,
    fontSerif: text(settings?.fontSerif) ?? d.fontSerif,
    fontSans: text(settings?.fontSans) ?? d.fontSans,
    fontStylesheets: stylesheets.length > 0 ? stylesheets : [...d.fontStylesheets],
    heroFocus: focus(settings?.heroFocusX, settings?.heroFocusY, d.heroFocusX, d.heroFocusY),
    heroFocusMobile: focus(
      settings?.heroFocusXMobile,
      settings?.heroFocusYMobile,
      d.heroFocusXMobile,
      d.heroFocusYMobile,
    ),
    heroScrim: percent(settings?.heroScrim, d.heroScrim),
    animations: settings?.enableAnimations ?? d.animations,
    parallax: settings?.enableParallax ?? d.parallax,
    partnerLogo: partnerLogo(settings),
    faviconUrl: faviconUrl(settings, accent, ink),
    skipLinkLabel: text(settings?.skipLinkLabel) ?? d.skipLinkLabel,
    footerNavLabel: text(settings?.footerNavLabel) ?? d.footerNavLabel,
    newsletterNoscript: text(settings?.newsletterNoscript) ?? d.newsletterNoscript,
    calendarTicketContext: text(settings?.calendarTicketContext) ?? d.calendarTicketContext,
    mailerliteAccountId: text(settings?.mailerliteAccountId) ?? d.mailerliteAccountId,
    mailerliteFormId: text(settings?.mailerliteFormId) ?? d.mailerliteFormId,
  }
}

/**
 * Die Gestaltung als CSS.
 *
 * Der Selektor ist `:root:root` und nicht `:root`: beides trifft dasselbe
 * Element, aber die Wiederholung zaehlt doppelt und gewinnt damit gegen
 * die Werte in site.css – unabhaengig davon, in welcher Reihenfolge
 * Next.js Stylesheet und dieses Stylchen in den <head> haengt. Ein
 * `!important` taete es auch, nur waere es dann ueberall im Weg, wo
 * jemand spaeter noch eine Regel schreibt.
 *
 * Geschrieben wird nur, was site.css schon kennt. Wer hier eine neue
 * Zeile braucht, legt zuerst im Stylesheet die Property an.
 */
export function designCss(design: Design): string {
  const rules = [
    `:root:root{`,
    `--pink:${design.accent};`,
    `--black:${design.ink};`,
    `--white:${design.hover};`,
    `--serif:${design.fontSerif};`,
    `--sans:${design.fontSans};`,
    `--hero-focus:${design.heroFocus};`,
    `--hero-focus-mobile:${design.heroFocusMobile};`,
    `--scrim:${design.heroScrim / 100};`,
    `--partner-logo-w:${design.partnerLogo.columnWidth};`,
    `--partner-logo-w-mobile:${design.partnerLogo.columnWidthMobile};`,
    `}`,
  ]

  // Aus heisst aus – auch fuer das, was schon laeuft, wenn dieses
  // Stylchen ankommt. Dieselbe Formulierung wie im Block fuer
  // prefers-reduced-motion am Ende von site.css.
  if (!design.animations) {
    rules.push(
      `*,*::before,*::after{animation:none!important;transition:none!important}`,
      `.reveal{opacity:1!important}`,
    )
  } else if (!design.parallax) {
    // Das Bild steht still, der Rest der Seite blendet weiter ein.
    rules.push(`.hero__bg{animation:none!important;transform:none!important}`)
  }

  return rules.join('')
}

/** «für Nutcracker Rewired am Samstag 19. Dezember» */
export function fillTicketContext(
  template: string,
  values: {production: string; date: string},
): string {
  return template
    .replaceAll('{produktion}', values.production)
    .replaceAll('{datum}', values.date)
}

/* ── Kleinteile ───────────────────────────────────────────────────── */

/** Leere Felder sind im Studio Leerzeichen oder null – beides heisst «nichts». */
function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function percent(value: number | null | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/** Zwei Zahlen zu einer object-position: «50% 28%». */
function focus(
  x: number | null | undefined,
  y: number | null | undefined,
  fallbackX: number,
  fallbackY: number,
): string {
  return `${percent(x, fallbackX)}% ${percent(y, fallbackY)}%`
}

function partnerLogo(settings: SiteSettingsData | null | undefined): Design['partnerLogo'] {
  const fallback = DESIGN_DEFAULTS.partnerLogo
  const show = settings?.showPartnerLogo ?? fallback.show
  const columnWidth = percent(settings?.partnerLogoWidth, fallback.columnWidth)
  const columnWidthMobile = percent(settings?.partnerLogoWidthMobile, fallback.columnWidthMobile)

  const uploaded = settings?.partnerLogo
  if (!uploaded?.asset) {
    return {...fallback, show, columnWidth, columnWidthMobile}
  }

  // Die Groesse des hochgeladenen Bildes nur, um dem Browser das
  // Seitenverhaeltnis vorab zu nennen – die Breite auf der Seite kommt
  // aus den beiden Zahlen oben.
  const dimensions = uploaded.asset.metadata?.dimensions

  return {
    show,
    src: urlFor(uploaded).width(600).url(),
    alt: text(uploaded.alt) ?? fallback.alt,
    width: dimensions?.width ?? fallback.width,
    height: dimensions?.height ?? fallback.height,
    columnWidth,
    columnWidthMobile,
  }
}

/**
 * Das Zeichen im Browser-Reiter: entweder das hochgeladene Bild oder ein
 * Feld in der Akzentfarbe mit einem Buchstaben darin – gezeichnet, nicht
 * hochgeladen, damit es jeder Farbaenderung von selbst folgt.
 */
function faviconUrl(
  settings: SiteSettingsData | null | undefined,
  accent: string,
  ink: string,
): string {
  if (settings?.faviconImage?.asset) {
    return urlFor(settings.faviconImage).width(512).height(512).url()
  }

  const letter = text(settings?.faviconLetter) ?? DESIGN_DEFAULTS.faviconLetter
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" fill="${accent}"/>` +
    `<text x="16" y="24" font-family="Garamond,Georgia,serif" font-size="26"` +
    ` text-anchor="middle" fill="${ink}">${escapeXml(letter)}</text>` +
    `</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
