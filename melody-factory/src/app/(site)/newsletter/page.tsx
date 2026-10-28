import {toPlainText} from '@portabletext/react'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'

import {NewsletterButton} from '@/components/NewsletterButton'
import {RichText} from '@/components/RichText'
import {SiteFooter} from '@/components/Sections'
import {siteUrl} from '@/sanity/env'
import {urlFor} from '@/sanity/image'
import {fetchEventPage, resolveFetchMode, type FetchMode} from '@/sanity/live'
import type {EventPageData} from '@/sanity/types'

/**
 * Die Seite wird bei der Anfrage gerechnet, nicht beim Bauen – dieselbe
 * Ueberlegung wie bei der Startseite, siehe dort.
 */
export const instant = false

/**
 * Was dasteht, solange die Felder im Studio leer sind.
 *
 * Zwei Faelle, ein Grund: diese Seite darf nie leer ankommen. Der Titel
 * fehlt, bis der Kunde den Reiter «Newsletter» einmal gespeichert hat –
 * die Vorbelegung des Schemas greift nur bei neuen Datensaetzen, und der
 * hier ist alt. Und eine leere Beschriftung heisst im Footer «Knopf
 * weg»; hier ist der Knopf der einzige Grund, warum die Seite existiert.
 */
const FALLBACK = {
  title: 'Newsletter',
  label: 'Newsletter abonnieren',
}

/**
 * Die Newsletter-Seite – die Anmeldung unter einer eigenen Adresse,
 * damit man ihren Link verschicken kann.
 *
 * Inhaltlich steht hier wenig: Titel, ein Satz darueber, warum man sich
 * eintragen soll, und der Knopf. Das Formular selbst gehoert MailerLite
 * und erscheint darueber – so bleibt alles, was mit Einwilligung,
 * Bestaetigungsmail und Abmeldung zu tun hat, an der Stelle, an der der
 * Kunde es ohnehin pflegt.
 *
 * Das Pop-up kommt auf dieser Seite auch von allein: im MailerLite-Konto
 * steht als Auslöser «nach 5 Sekunden», und das gilt auf jeder Seite.
 * Wer dem Link folgt, bekommt das Formular also ohne einen Klick – der
 * Knopf ist fuer alle, die es zugeklappt haben oder es schon einmal
 * gesehen haben.
 *
 * Aufbau wie beim Kalender: statisch fuer Besucher, dynamisch nur in der
 * Vorschau – und das hinter einer Suspense-Grenze, damit die statische
 * Huelle bleibt.
 */
export default async function NewsletterRoute() {
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
    <main className="page page--sub">
      <header className="subhead">
        <Link className="logo" href="/" prefetch={false}>
          {page.logoText}
        </Link>

        {/* Dieselbe Ecke wie auf der Startseite, dieselbe Datei – hier
            aber schwarz, weil sie auf der Magentaflaeche steht. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="partner-logo"
          src="/3fach-logo.png"
          width={673}
          height={300}
          alt="3FACH"
        />
      </header>

      <section className="section news" id="programm">
        <h1 className="h-serif news__title reveal">
          {page.newsletterTitle || FALLBACK.title}
        </h1>

        <div className="news__body">
          <RichText value={page.newsletterLead} className="news__lead" />

          <p className="news__action reveal">
            <NewsletterButton label={page.newsletterLabel || FALLBACK.label} />
          </p>

          {/* Der Knopf erscheint erst nach der Hydration – ohne
              JavaScript gaebe es nichts zu klicken, und MailerLite
              braucht es ohnehin. Dann steht hier wenigstens, woran es
              liegt, statt einer leeren Stelle. */}
          <noscript>
            <p className="news__lead">
              Für die Anmeldung muss JavaScript eingeschaltet sein.
            </p>
          </noscript>
        </div>
      </section>

      <SiteFooter page={page} />
    </main>
  )
}

/**
 * Titel und Beschreibung fuer den verschickten Link.
 *
 * Die Beschreibung ist der Lead von oben, von der Auszeichnung befreit –
 * ein zweites Feld dafuer waere eine zweite Stelle, die veralten kann.
 * Vorschaubild und Rahmen kommen von der Startseite, genau wie beim
 * Kalender: ein eigenes zu pflegen braechte dem Kunden nichts.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = (await fetchEventPage(await resolveFetchMode())) as EventPageData | null

  if (!page) {
    return {
      title: 'Newsletter – Melody Factory',
      description: 'Inhalte werden noch gepflegt.',
    }
  }

  const title = `${page.newsletterTitle || FALLBACK.title} – ${page.footerWordmark}`
  const description = page.newsletterLead?.length
    ? toPlainText(page.newsletterLead)
    : page.metaDescription

  const share = page.shareImage?.asset
    ? page.shareImage
    : page.heroImage?.asset
      ? page.heroImage
      : null
  const shareImage = share ? urlFor(share).width(1200).height(630).fit('crop').url() : undefined

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'de_CH',
      title,
      description,
      images: shareImage ? [{url: shareImage, width: 1200, height: 630}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
  }
}

/** Solange im Studio noch nichts steht, bleibt die Seite trotzdem bedienbar. */
function NotSeededYet() {
  return (
    <main className="page page--sub">
      <section className="section news" id="programm">
        <h1 className="h-serif news__title">Newsletter</h1>
        <p className="news__lead">
          Hier erscheint die Anmeldung, sobald die Texte im Studio erfasst sind.{' '}
          <Link href="/">Zur Startseite</Link>
        </p>
      </section>
    </main>
  )
}
