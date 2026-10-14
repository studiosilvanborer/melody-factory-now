import type {CSSProperties} from 'react'

import {formatClock, formatWeekdayDate, machineDateTime} from '@/lib/format'
import type {CalendarEntry, CalendarPageData} from '@/sanity/types'

/**
 * Die Terminliste.
 *
 * Eine Zeile besteht aus drei Feldern: wann, was, Tickets. Die Linien
 * dazwischen sind das Gestaltungsmittel des Flyers – die dicke oben,
 * die duennen zwischen den Zeilen.
 *
 * Als <ol>, nicht als Tabelle: es ist eine geordnete Liste von
 * Terminen, keine Matrix aus Zeilen und Spalten. Vorleseprogramme
 * nennen so die Anzahl der Termine, statt Spaltenkoepfe anzusagen, die
 * es gar nicht gibt.
 */
export function CalendarSection({page}: {page: CalendarPageData}) {
  const entries = page.entries ?? []

  return (
    <section className="section cal" id="programm">
      <h1 className="h-serif cal__title reveal">{page.title}</h1>

      {entries.length > 0 ? (
        <ol className="cal__list">
          {entries.map((entry, index) => (
            <CalendarRow
              key={`${entry.startsAt}-${index}`}
              entry={entry}
              index={index}
            />
          ))}
        </ol>
      ) : (
        <p className="cal__empty reveal">{page.emptyText}</p>
      )}
    </section>
  )
}

function CalendarRow({entry, index}: {entry: CalendarEntry; index: number}) {
  const date = formatWeekdayDate(entry.startsAt)

  return (
    <li className="cal__row reveal" style={stagger(index)}>
      <p className="cal__when">
        <time dateTime={machineDateTime(entry.startsAt)}>
          <span className="cal__date">{date}</span>
          <span className="cal__clock">{formatClock(entry.startsAt)}</span>
        </time>
      </p>

      <p className="cal__what">
        <span className="cal__venue">{entry.venue}</span>
        <span className="cal__production">{entry.production}</span>
      </p>

      <a className="cal__tickets" href={entry.ticketUrl} target="_blank" rel="noopener">
        {entry.ticketLabel}
        {/* Sechsmal «Tickets» untereinander sagt vorgelesen nichts aus –
            welcher Termin gemeint ist, steht nur in der Zeile daneben. */}
        <span className="visually-hidden">{` für ${entry.production} am ${date}`}</span>
      </a>
    </li>
  )
}

/**
 * Der Versatz beim Einblenden, Zeile um Zeile – dieselbe Mechanik wie
 * bei den Fakten der Startseite, nur ohne feste Obergrenze: die Liste
 * darf beliebig lang werden.
 */
function stagger(index: number): CSSProperties {
  return {'--i': index} as CSSProperties
}
