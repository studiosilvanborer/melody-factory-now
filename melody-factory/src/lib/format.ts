/** Die Veranstaltung findet in Luzern statt – also wird auch so gerechnet. */
const TIME_ZONE = 'Europe/Zurich'

/** «7. November 2026» */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(new Date(iso))
}

/** «20:00 Uhr» */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const time = new Intl.DateTimeFormat('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(new Date(iso))
  return `${time} Uhr`
}

/**
 * «Samstag 7. November» – fuer den Kalender.
 *
 * Ohne Jahr: das steht in der Ueberschrift ueber der Liste. Ohne Komma
 * nach dem Wochentag, wie im Entwurf – Intl setzt es, also faellt es
 * hier wieder weg.
 */
export function formatWeekdayDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TIME_ZONE,
  })
    .format(new Date(iso))
    .replace(',', '')
}

/** «20.00» – Schweizer Schreibweise aus dem Entwurf, ohne «Uhr». */
export function formatClock(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  })
    .format(new Date(iso))
    .replace(':', '.')
}

/** Fuer <time datetime="…">: «2026-11-07T20:00» */
export function machineDateTime(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 16) : ''
}

/**
 * Externe Links gehen in einem neuen Tab auf, interne nicht. Das aus dem
 * Ziel abzuleiten erspart dem Kunden ein Ankreuzfeld, bei dem er nur
 * falsch liegen kann.
 */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href.trim())
}

/**
 * YouTube- und Vimeo-Adressen in ihre Einbettungsform bringen. Alles
 * andere wird unveraendert durchgelassen – wer eine fertige Embed-URL
 * hinterlegt, soll damit auch durchkommen.
 */
export function embedUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()

  const youtube = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  if (youtube) {
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`
  }

  return trimmed
}
