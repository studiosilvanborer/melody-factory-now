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

        {/* Partnerlogo gegenueber der Wortmarke.
            Kein next/image: die Datei liegt fertig in /public und ist
            kleiner als der Aufwand, sie unterwegs umzurechnen. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="partner-logo on-load"
          src="/3fach-logo.png"
          width={673}
          height={300}
          alt="3FACH"
        />
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

          {/* Gleiche Groesse, gleiche Form, nur als Umriss: beide Wege
              stehen nebeneinander, aber der Ticketkauf bleibt der
              gefuellte und damit der erste. */}
          {page.calendarLabel ? (
            /* prefetch aus: Next holt sonst beim Ueberfahren schon die
               Terminliste und zeigt beim Klick genau diesen Stand –
               wer vorher im Studio etwas geaendert hat, saehe ihn erst
               nach einem zweiten Laden. Bei zwei Seiten ist das
               Vorausladen kein Gewinn, der alte Stand aber ein Aerger. */
            <Link
              className="btn btn--cta btn--ghost on-load"
              href="/kalender"
              prefetch={false}
            >
              {page.calendarLabel}
            </Link>
          ) : null}
        </div>

        <div className="bar on-load on-load--wipe" />
      </div>
    </main>
  )
}
