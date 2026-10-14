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

      <Tickets entry={entry} date={date} />
    </li>
  )
}

/**
 * Die Schaltflaeche am rechten Rand der Zeile.
 *
 * Steht im Studio kein Ticket-Link, gibt es nichts zu verlinken – dann
 * ist es keine Schaltflaeche, sondern eine Auskunft: gleiche Pille, nur
 * als Umriss und ohne Ziel. Sobald der Vorverkauf steht und die Adresse
 * eingetragen ist, wird daraus von selbst der aktive Knopf.
 *
 * Darum auch <span> statt <a>: ein Link ohne href ist fuer die Tastatur
 * und fuer Vorleseprogramme kein Link, und ein deaktivierter Knopf, den
 * man anspringen kann, ist eine Sackgasse. `aria-disabled` sagt es
 * denen, die es wissen muessen.
 */
function Tickets({entry, date}: {entry: CalendarEntry; date: string}) {
  // Sechsmal «Tickets» untereinander sagt vorgelesen nichts aus – welcher
  // Termin gemeint ist, steht nur in der Zeile daneben.
  const context = <span className="visually-hidden">{` für ${entry.production} am ${date}`}</span>

  if (!entry.ticketUrl) {
    return (
      <span className="btn cal__tickets cal__tickets--off" aria-disabled="true">
        {entry.ticketLabel}
        {context}
      </span>
    )
  }

  return (
    <a
      className="btn cal__tickets"
      href={entry.ticketUrl}
      target="_blank"
      rel="noopener"
    >
      {entry.ticketLabel}
      {context}
    </a>
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
