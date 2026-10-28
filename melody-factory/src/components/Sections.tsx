import Link from 'next/link'

import {RichText} from '@/components/RichText'
import {embedUrl, formatDate, formatTime, isExternal} from '@/lib/format'
import type {CastMember, EventPageData, Fact, FooterLink} from '@/sanity/types'

/** Eine Zeile «Bezeichnung · Angabe». */
function FactRow({label, value}: Fact) {
  return (
    <p className="fact reveal">
      <span className="fact__label">{label}</span>
      <span className="fact__value">{value}</span>
    </p>
  )
}

export function IntroSection({page}: {page: EventPageData}) {
  return (
    <section className="section intro" id="programm">
      <h2 className="h-serif intro__title reveal">{page.introTitle}</h2>
      <RichText value={page.introLead} className="intro__lead" />
    </section>
  )
}

/** «Zeit / Ort» und «Besetzung» stehen im selben zweispaltigen Block. */
export function FactsAndCastSection({page}: {page: EventPageData}) {
  const facts: Fact[] = [
    {label: page.labelDuration, value: page.duration},
    {label: page.labelVenue, value: page.venueFull},
    ...(page.additionalInfo
      ? [{label: page.labelAdditionalInfo, value: page.additionalInfo}]
      : []),
    ...(page.additionalFacts ?? []),
  ]

  // Die Besetzung laeuft ueber zwei Spalten. Bei ungerader Anzahl ist die
  // linke die laengere – so bleibt die rechte Spalte nie allein stehen.
  const cast: CastMember[] = page.cast ?? []
  const split = Math.ceil(cast.length / 2)
  const castColumns = [cast.slice(0, split), cast.slice(split)].filter(
    (column) => column.length > 0,
  )

  return (
    <section className="section cols">
      <div className="col">
        <h3 className="h-serif col__title reveal">{page.factsTitle}</h3>
        <div className="facts">
          {facts.map((fact, index) => (
            <FactRow key={`${fact.label}-${index}`} {...fact} />
          ))}
        </div>
      </div>

      <div className="col">
        <h3 className="h-serif col__title reveal">{page.castTitle}</h3>
        <div className="cast">
          {castColumns.map((column, columnIndex) => (
            <div className="facts" key={columnIndex}>
              {column.map((member, index) => (
                <FactRow
                  key={`${member.name}-${index}`}
                  label={member.role}
                  value={member.name}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** «Infos» und «Trailer» teilen sich den zweiten zweispaltigen Block. */
export function InfosAndTrailerSection({page}: {page: EventPageData}) {
  // Eine hochgeladene Datei schlaegt den Link: wer eine hinterlegt, meint
  // sie auch. Der Link bleibt fuer YouTube und Vimeo.
  const file = page.trailerVideo?.asset?.url
  const embed = file ? null : embedUrl(page.trailerUrl)

  return (
    <section className="section cols">
      <div className="col">
        <h3 className="h-serif col__title reveal">{page.infosTitle}</h3>
        <RichText value={page.infosText} className="infos__text" />
        {page.infosOutro ? (
          <p className="infos__outro reveal">{page.infosOutro}</p>
        ) : null}
      </div>

      <div className="col">
        <h3 className="h-serif col__title reveal">{page.trailerTitle}</h3>
        {file ? (
          /* Das eigene Video bringt sein Format selbst mit – der Rahmen
             legt ihm keines auf, sonst schnitte er ein Hochformat auf
             16:9 zurecht und zeigte vom Bild nur einen Streifen. */
          <div className="trailer__frame trailer__frame--native reveal">
            <video
              src={file}
              controls
              playsInline
              preload="metadata"
              title={`${page.trailerTitle} – ${page.wordmark}`}
            />
          </div>
        ) : (
          <div className="trailer__frame reveal">
            {embed ? (
              <iframe
                src={embed}
                title={`${page.trailerTitle} – ${page.wordmark}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <span className="visually-hidden">{page.trailerPlaceholder}</span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export function SiteFooter({page}: {page: EventPageData}) {
  const columns = (page.footerLinkColumns ?? []).filter(
    (column) => (column.links ?? []).length > 0,
  )

  return (
    <footer className="footer">
      <div className="footer__top reveal">
        <nav className="footer__links" aria-label="Footer">
          {columns.map((column, columnIndex) => (
            <ul className="linkgroup" key={columnIndex}>
              {(column.links ?? []).map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <FooterLinkItem link={link} />
                </li>
              ))}
            </ul>
          ))}
        </nav>

        <div className="cta">
          <div>
            <p className="h-serif cta__title">{page.ctaTitle}</p>
            <p className="cta__meta">
              {[formatDate(page.startsAt), formatTime(page.startsAt), page.venueFull]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <a className="btn" href={page.ticketUrl} target="_blank" rel="noopener">
            {page.ticketLabel}
          </a>

          {/* Der Newsletter steht unter dem Ticketkauf und nicht neben
              ihm: zwei Pillen nebeneinander lasen sich wie zwei gleich
              wichtige Ziele. Als schlichte Zeile bleibt er der zweite
              Weg, erkennbar aber nachgeordnet.

              Er fuehrt auf /newsletter und oeffnet nicht mehr selbst das
              Formular: ein Pop-up ueber dem Seitenfuss kam aus dem
              Nichts, die Seite dagegen sagt erst, worum es geht. Und was
              man anklickt, kann man weiterschicken.

              prefetch aus, wie bei den Links darunter – lieber eine
              Anfrage mehr als ein veralteter Stand beim Klick. */}
          {page.newsletterLabel ? (
            <Link className="cta__newsletter" href="/newsletter" prefetch={false}>
              {page.newsletterLabel}
            </Link>
          ) : null}
        </div>
      </div>

      <p className="footer__wordmark reveal">{page.footerWordmark}</p>

      <p className="footer__legal reveal">{page.footerLegal}</p>
    </footer>
  )
}

/**
 * Drei Arten von Zielen, drei Verhalten: eine andere Seite dieser
 * Website geht ueber next/link (kein Neuladen, Vorausladen beim
 * Ueberfahren), eine fremde Adresse in einem neuen Tab, alles andere –
 * mailto:, tel:, Sprungmarken – als schlichter Link.
 */
function FooterLinkItem({link}: {link: FooterLink}) {
  const href = link.href.trim()

  if (href.startsWith('/')) {
    // prefetch aus, aus demselben Grund wie beim Kalender-Knopf im Hero:
    // lieber eine Anfrage mehr als ein veralteter Stand beim Klick.
    return (
      <Link href={href} prefetch={false}>
        {link.label}
      </Link>
    )
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener">
        {link.label}
      </a>
    )
  }

  return <a href={href}>{link.label}</a>
}
