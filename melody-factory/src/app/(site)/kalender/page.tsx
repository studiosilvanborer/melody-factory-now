import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'

import {CalendarSection} from '@/components/Calendar'
import {SiteFooter} from '@/components/Sections'
import {siteUrl} from '@/sanity/env'
import {urlFor} from '@/sanity/image'
import {
  fetchCalendarPage,
  fetchEventPage,
  resolveFetchMode,
  type FetchMode,
} from '@/sanity/live'
import type {CalendarPageData, EventPageData} from '@/sanity/types'

/**
 * Die Seite wird bei der Anfrage gerechnet, nicht beim Bauen.
 *
 * Das ist die Kehrseite der kurzen Cache-Lebensdauer in live.ts: Next
 * nimmt nur Inhalte in die vorgerechnete Huelle auf, die laenger als
 * fuenf Minuten gelten. Die Wahl steht also zwischen «vorgerechnet,
 * dafuer bis zu zweimal laden nach einer Aenderung» und «bei der
 * Anfrage gerechnet, dafuer beim ersten Laden aktuell».
 *
 * Fuer eine gepflegte Seite ist das zweite richtig: der Kunde aendert
 * etwas und sieht es, ohne zu wissen, was ein Cache ist. Gekostet ist
 * es fast nichts – eine Abfrage an Sanity, gebuendelt ueber zwei
 * Sekunden, bei dieser Seitengroesse im Millisekundenbereich.
 *
 * Soll die Seite wieder statisch werden, ist der Weg ein GROQ-Webhook
 * aus sanity.io/manage auf eine Revalidierungs-Route – dann darf die
 * Lebensdauer wieder lang sein, weil Sanity selbst Bescheid gibt.
 */
export const instant = false

/**
 * Die Kalender-Seite.
 *
 * Zwei Datensaetze treffen sich hier: der Kalender liefert Ueberschrift
 * und Termine, die Startseite Wortmarke und Footer. Der Footer ist
 * damit auf jeder Seite derselbe und wird an einer Stelle gepflegt.
 *
 * Aufbau wie bei der Startseite: statisch fuer Besucher, dynamisch nur
 * in der Vorschau – und das hinter einer Suspense-Grenze, damit die
 * statische Huelle bleibt.
 */
export default async function CalendarRoute() {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={null}>
        <DraftPage />
      </Suspense>
    )
  }

  return <PageContent mode={{perspective: 'published', stega: false}} />
}

async function DraftPage() {
  return <PageContent mode={await resolveFetchMode()} />
}

async function PageContent({mode}: {mode: FetchMode}) {
  const [calendar, event] = await Promise.all([
    fetchCalendarPage(mode) as Promise<CalendarPageData | null>,
    fetchEventPage(mode) as Promise<EventPageData | null>,
  ])

  if (!calendar) return <NotSeededYet />

  return (
    <main className="page page--sub">
      <header className="subhead">
        <Link className="logo" href="/">
          {event?.logoText ?? 'MELODY FACTORY'}
        </Link>
      </header>

      <CalendarSection page={calendar} />

      {event ? <SiteFooter page={event} /> : null}
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const mode = await resolveFetchMode()
  const [calendar, event] = await Promise.all([
    fetchCalendarPage(mode) as Promise<CalendarPageData | null>,
    fetchEventPage(mode) as Promise<EventPageData | null>,
  ])

  if (!calendar) {
    return {title: 'Termine – Melody Factory', description: 'Inhalte werden noch gepflegt.'}
  }

  // Das Vorschaubild kommt von der Startseite – der Kalender hat kein
  // eigenes, und ein zweites zu pflegen brächte dem Kunden nichts.
  const share = event?.shareImage?.asset
    ? event.shareImage
    : event?.heroImage?.asset
      ? event.heroImage
      : null
  const shareImage = share ? urlFor(share).width(1200).height(630).fit('crop').url() : undefined

  return {
    metadataBase: new URL(siteUrl),
    title: calendar.metaTitle,
    description: calendar.metaDescription,
    openGraph: {
      type: 'website',
      locale: 'de_CH',
      title: calendar.metaTitle,
      description: calendar.metaDescription,
      images: shareImage ? [{url: shareImage, width: 1200, height: 630}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: calendar.metaTitle,
      description: calendar.metaDescription,
      images: shareImage ? [shareImage] : undefined,
    },
  }
}

/** Solange im Studio noch nichts steht, bleibt die Seite trotzdem bedienbar. */
function NotSeededYet() {
  return (
    <main className="page page--sub">
      <section className="section cal" id="programm">
        <h1 className="h-serif cal__title">Termine</h1>
        <p className="cal__empty">
          Hier erscheinen die Termine, sobald sie im Studio erfasst sind.{' '}
          <Link href="/">Zur Startseite</Link>
        </p>
      </section>
    </main>
  )
}
