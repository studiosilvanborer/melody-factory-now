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

/**
 * Wie lange eine Antwort aus Sanity gilt.
 *
 * Die Zahlen sehen klein aus, und das ist Absicht. Entscheidend ist der
 * Abstand zwischen `revalidate` und `expire`:
 *
 *   revalidate  ab hier frischt der Server im Hintergrund auf und
 *               liefert dem Anfragenden noch den alten Stand
 *   expire      ab hier wartet die Anfrage auf frische Daten
 *
 * Zwischen beiden liegt das Fenster, in dem ein Neuladen noch den alten
 * Stand zeigt und erst das zweite den neuen – das beruehmte «ich muss
 * zweimal laden». Mit `minutes` war dieses Fenster 59 Minuten breit.
 * Hier ist es eine Sekunde: wer nach dem Speichern im Studio neu laedt,
 * wartet die paar Millisekunden auf Sanity und sieht den neuen Stand
 * beim ersten Mal.
 *
 * Der Preis ist eine Abfrage je Seitenaufruf, sofern nicht mehrere
 * innerhalb von zwei Sekunden zusammenfallen. Fuer eine Seite dieser
 * Groesse ist das nichts; waechst der Verkehr sehr stark, sind hoehere
 * Werte hier die eine Stelle, an der man dreht.
 *
 * `stale: 0`, damit auch der Router im Browser nichts Altes aufhebt.
 */
const LIFETIME = {stale: 0, revalidate: 1, expire: 2}

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
 * Zur Lebensdauer – siehe LIFETIME.
 */
export async function fetchEventPage(mode: FetchMode) {
  'use cache'
  cacheLife(LIFETIME)
  const {data} = await sanityFetch({query: EVENT_PAGE_QUERY, ...mode})
  return data
}

/** Ueberschrift und Terminliste des Kalenders. Gleiche Regeln wie oben. */
export async function fetchCalendarPage(mode: FetchMode) {
  'use cache'
  cacheLife(LIFETIME)
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
