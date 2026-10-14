import {cacheLife} from 'next/cache'
import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
} from 'next-sanity/live'

import {client} from './client'
import {CALENDAR_PAGE_QUERY, EVENT_PAGE_QUERY} from './queries'

/**
 * Live Content API.
 *
 * Was der Kunde im Studio speichert, erscheint auf der Seite, ohne dass
 * jemand neu deployen muss: Sanity meldet die Aenderung, Next.js verwirft
 * genau die betroffenen Cache-Eintraege und baut die Seite neu.
 *
 * Ohne Token laufen nur veroeffentlichte Inhalte – der Normalfall fuer
 * Besucher. Mit Lesetoken zeigt die Vorschau im Studio zusaetzlich die
 * noch unveroeffentlichten Entwuerfe.
 */
const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  // Der Token bleibt auf dem Server. Die Vorschau im Studio aktualisiert
  // sich ueber das Presentation-Werkzeug und braucht ihn im Browser nicht –
  // und was nicht im Browser landet, kann dort auch nicht abgegriffen werden.
  browserToken: false,
})

/** Wie gelesen wird: veroeffentlicht fuer Besucher, Entwurf in der Vorschau. */
export type FetchMode = {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

/**
 * Die Inhalte der Seite.
 *
 * `use cache` ist Pflicht: sanityFetch markiert das Ergebnis intern mit
 * cacheTag, und das geht nur innerhalb einer Cache-Grenze. Der Modus
 * kommt als Argument herein – er wird ausserhalb aufgeloest, weil
 * Cookies und draftMode in einer gecachten Funktion nichts zu suchen
 * haben.
 *
 * Zur Lebensdauer: `minutes` heisst eine Minute bis zur Auffrischung im
 * Hintergrund. Das ist die Untergrenze, unter der eine Aenderung im
 * Studio *garantiert* auf der Seite ankommt.
 *
 * Ohne diese Zeile gilt das Standardprofil mit 15 Minuten – und genau
 * das sah aus wie «das CMS haengt nicht dran»: Wer im Studio speichert
 * und die Seite neu laedt, sieht den alten Stand. Die Live Content API
 * federt das nur ab, solange die Seite in einem Tab offen *ist*, wenn
 * gespeichert wird; dann kommt die Aenderung sofort. Ist kein Tab
 * offen, meldet niemand den Treffer, und es bleibt beim Zeitablauf.
 */
export async function fetchEventPage(mode: FetchMode) {
  'use cache'
  cacheLife('minutes')
  const {data} = await sanityFetch({query: EVENT_PAGE_QUERY, ...mode})
  return data
}

/** Ueberschrift und Terminliste des Kalenders. Gleiche Regeln wie oben. */
export async function fetchCalendarPage(mode: FetchMode) {
  'use cache'
  cacheLife('minutes')
  const {data} = await sanityFetch({query: CALENDAR_PAGE_QUERY, ...mode})
  return data
}

/**
 * Loest draftMode und die Perspektiv-Cookies auf, die die Vorschau im
 * Studio setzt. Muss ausserhalb jeder Cache-Grenze laufen.
 */
export async function resolveFetchMode(): Promise<FetchMode> {
  const {isEnabled} = await draftMode()
  if (!isEnabled) return {perspective: 'published', stega: false}

  const jar = await cookies()
  return {
    perspective: (await resolvePerspectiveFromCookies({cookies: jar})) ?? 'drafts',
    variant: await resolveVariantFromCookies({cookies: jar}),
    stega: true,
  }
}
