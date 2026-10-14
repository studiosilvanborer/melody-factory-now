import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'

import {Hero} from '@/components/Hero'
import {
  FactsAndCastSection,
  InfosAndTrailerSection,
  IntroSection,
  SiteFooter,
} from '@/components/Sections'
import {fetchEventPage, resolveFetchMode, type FetchMode} from '@/sanity/live'
import type {EventPageData} from '@/sanity/types'

/**
 * Fuer Besucher ist die Seite statisch vorgerechnet und wird von der
 * Live Content API aktualisiert, sobald im Studio gespeichert wird.
 *
 * In der Vorschau dagegen muss pro Aufruf entschieden werden, welche
 * Perspektive gilt – das liest Cookies, ist also dynamisch und gehoert
 * hinter eine Suspense-Grenze, damit die statische Huelle bleibt.
 */
export default async function Page() {
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
  const page = (await fetchEventPage(mode)) as EventPageData | null

  if (!page) return <NotSeededYet />

  return (
    <>
      <Hero page={page} />

      <div className="page">
        <IntroSection page={page} />
        <FactsAndCastSection page={page} />
        <InfosAndTrailerSection page={page} />
        <SiteFooter page={page} />
      </div>
    </>
  )
}

/**
 * Was zu sehen ist, solange im Studio noch kein Inhalt liegt. Ohne das
 * waere die Seite einfach weiss, und niemand wuesste, woran es fehlt.
 */
function NotSeededYet() {
  return (
    <div className="page">
      <section className="section intro" id="programm">
        <h2 className="h-serif intro__title">Noch keine Inhalte.</h2>
        <p className="intro__lead">
          Im Studio liegt noch kein Datensatz. Einmal{' '}
          <code>npm run seed</code> ausfuehren oder unter{' '}
          <Link href="/studio">/studio</Link> die Inhalte der Seite anlegen.
        </p>
      </section>
    </div>
  )
}
