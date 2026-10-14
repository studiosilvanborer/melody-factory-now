import {defineArrayMember, defineField, defineType} from 'sanity'
// @sanity/icons liefert die Symbole ab v5 nur noch einzeln ueber Unterpfade.
import {CalendarIcon} from '@sanity/icons/Calendar'
import {SearchIcon} from '@sanity/icons/Search'

/**
 * Die Kalender-Seite unter /kalender.
 *
 * Ein Titel, darunter eine Liste von Terminen – mehr ist die Seite
 * nicht, und mehr soll sie auch nicht sein. Die Ueberschrift ist freier
 * Text und keine gerechnete Monatsangabe: so steht dort, was der Kunde
 * will («Termine», «Spielzeit 2026/27», «November 2027»), auch wenn die
 * Liste ueber mehrere Monate laeuft.
 *
 * Der erste Termin ist bewusst nicht mit dem Datum der Startseite
 * verdrahtet. Die Startseite zeigt eine Veranstaltung, der Kalender
 * zeigt alle – wer beides koppelte, koennte den Kalender nicht mehr
 * ueber das aktuelle Datum hinaus pflegen.
 */
export const calendarPage = defineType({
  name: 'calendarPage',
  title: 'Kalender',
  type: 'document',
  groups: [
    {name: 'calendar', title: 'Termine', icon: CalendarIcon, default: true},
    {name: 'seo', title: 'Suchmaschinen & Social', icon: SearchIcon},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string',
      group: 'calendar',
      description: 'Die grosse Garamond-Zeile über der Liste.',
      initialValue: 'Termine',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'entries',
      title: 'Termine',
      type: 'array',
      group: 'calendar',
      description:
        'Eine Zeile je Vorstellung, in der Reihenfolge, in der sie auf der Seite stehen sollen.',
      of: [defineArrayMember({type: 'calendarEntry'})],
    }),
    defineField({
      name: 'emptyText',
      title: 'Text ohne Termine',
      type: 'string',
      group: 'calendar',
      description: 'Steht anstelle der Liste, solange kein Termin erfasst ist.',
      initialValue: 'Neue Termine folgen in Kürze.',
      validation: (rule) => rule.required().max(120),
    }),

    /* ── Suchmaschinen & Social ────────────────────────────────────── */
    defineField({
      name: 'metaTitle',
      title: 'Titel im Browser-Tab',
      type: 'string',
      group: 'seo',
      description: 'Auch die Zeile, die Google als Erstes zeigt. Rund 60 Zeichen.',
      initialValue: 'Termine – Melody Factory',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Beschreibung für Suchmaschinen',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Der Text unter dem Titel im Suchergebnis. Rund 155 Zeichen.',
      initialValue: 'Alle Termine der Melody Factory – Daten, Orte und Tickets auf einen Blick.',
      validation: (rule) => rule.required().max(180),
    }),
  ],

  preview: {
    select: {title: 'title', entries: 'entries'},
    prepare: ({title, entries}: {title?: string; entries?: unknown[]}) => {
      const count = entries?.length ?? 0
      return {
        title: title || 'Kalender',
        subtitle: count === 1 ? '1 Termin' : `${count} Termine`,
      }
    },
  },
})
