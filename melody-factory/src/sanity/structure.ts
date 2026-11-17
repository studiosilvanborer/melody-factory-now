import {CalendarIcon} from '@sanity/icons/Calendar'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import type {StructureResolver} from 'sanity/structure'

/**
 * Die Seitenleiste des Studios.
 *
 * Jede Seite der Website hat genau einen Datensatz, und der soll sich
 * wie eine Einstellungsmaske anfuehlen, nicht wie ein Archiv: kein «Neu
 * anlegen», keine Liste mit einem Eintrag darin, kein Loeschen. Ein
 * Klick auf den Eintrag und das Formular ist offen.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Melody Factory')
    .items([
      S.listItem()
        .title('Inhalte der Seite')
        .icon(DocumentTextIcon)
        .id('eventPage')
        .child(
          S.document()
            .schemaType('eventPage')
            .documentId('eventPage')
            .title('Inhalte der Seite'),
        ),
      S.listItem()
        .title('Kalender')
        .icon(CalendarIcon)
        .id('calendarPage')
        .child(
          S.document()
            .schemaType('calendarPage')
            .documentId('calendarPage')
            .title('Kalender'),
        ),
      // Die Gestaltung steht unter den Inhalten, nicht ueber ihnen: man
      // pflegt sie einmal und dann selten wieder.
      S.divider(),
      S.listItem()
        .title('Gestaltung')
        .icon(ColorWheelIcon)
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Gestaltung'),
        ),
    ])

/** Dokumenttypen, die nicht ueber «Neu anlegen» auftauchen sollen. */
export const singletonTypes = new Set(['eventPage', 'calendarPage', 'siteSettings'])

/** Aktionen, die es bei einem Einzeldatensatz nicht geben darf. */
export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
