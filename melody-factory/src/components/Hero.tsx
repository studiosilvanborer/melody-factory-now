import Link from 'next/link'

import {urlFor} from '@/sanity/image'
import type {EventPageData} from '@/sanity/types'
import {formatDate, formatTime} from '@/lib/format'

/**
 * Der erste Bildschirm: Plakatkomposition aus Bild, Claim, Wortmarke und
 * Ticket-Aufruf. Die Positionen der Meta-Zeilen stecken in den Klassen
 * m-claim-1 … m-date; sie sind absolut gesetzt, darum ist die Reihenfolge
 * im Markup frei.
 */
export function Hero({page}: {page: EventPageData}) {
  const image = page.heroImage
  const dimensions = image?.asset?.metadata?.dimensions

  return (
    <main className="hero">
      {image?.asset ? (
        // Bewusst kein next/image: die Bildquelle liegt schon auf dem
        // Sanity-CDN, das Format und Groesse selbst aushandelt. Ein
        // zweiter Optimierer davor kostet nur Rechenzeit – und <img>
        // laesst die Parallax-Regeln auf .hero__bg unberuehrt.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="hero__bg"
          src={urlFor(image).width(2400).quality(80).url()}
          srcSet={[960, 1440, 1920, 2400, 3000]
            .map((w) => `${urlFor(image).width(w).quality(80).url()} ${w}w`)
            .join(', ')}
          sizes="100vw"
          width={dimensions?.width}
          height={dimensions?.height}
          alt={image.alt ?? ''}
          fetchPriority="high"
        />
      ) : null}
      <div className="hero__scrim" aria-hidden="true" />

      <header className="header">
        <Link className="logo on-load" href="/">
          {page.logoText}
        </Link>

        {/* Die Kopfzeile traegt genau eine Schaltflaeche: den Weg zur
            Terminliste. Der Ticketkauf steht bewusst nicht hier, sondern
            als groesstes Bedienelement unten in der Komposition. */}
        {page.calendarLabel ? (
          <nav className="nav" aria-label="Hauptnavigation">
            <Link className="btn on-load" href="/kalender">
              {page.calendarLabel}
            </Link>
          </nav>
        ) : null}
      </header>

      <div className="lower">
        <p className="meta">
          <span className="on-load m-claim-1" lang={page.claimLanguage ?? 'en'}>
            {page.claimLine1}
          </span>
          <span className="on-load m-claim-2" lang={page.claimLanguage ?? 'en'}>
            {page.claimLine2}
          </span>
          <span className="on-load m-venue">{page.venueShort}</span>
          <span className="on-load m-city">{page.city}</span>
          <span className="m-break" aria-hidden="true" />
          <span className="on-load m-date">{formatDate(page.startsAt)}</span>
          <span className="on-load m-time">{formatTime(page.startsAt)}</span>
        </p>

        <div className="lower__row">
          <h1 className="wordmark on-load">{page.wordmark}</h1>

          <a
            className="btn btn--cta on-load"
            href={page.ticketUrl}
            target="_blank"
            rel="noopener"
          >
            {page.ticketLabel}
          </a>
        </div>

        <div className="bar on-load on-load--wipe" />
      </div>
    </main>
  )
}
