'use client'

import {deDELocale} from '@sanity/locale-de-de'
import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId, siteUrl, studioBasePath} from './src/sanity/env'
import {StudioIcon} from './src/sanity/StudioIcon'
import {schemaTypes} from './src/sanity/schema'
import {singletonActions, singletonTypes, structure} from './src/sanity/structure'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * Die Farben des Flyers, hier als Konstanten – dieselben Werte wie die
 * Entwurfswerte in src/styles/site.css und src/sanity/design.ts.
 *
 * Sie koennen nicht aus dem Studio selbst kommen: diese Datei wird
 * gelesen, bevor das Studio eine Verbindung hat, und ein Formular, dessen
 * Farben sich beim Tippen aendern, waere ohnehin keine gute Idee. Wer das
 * Magenta der Seite wechselt, wechselt es hier mit.
 */
const BRAND = {
  accent: '#e4017e',
  ink: '#111111',
  paper: '#ffffff',
}

/**
 * Das Studio in den Farben der Seite.
 *
 * Bewusst nur die tragenden Flaechen: Navigationsleiste schwarz,
 * Hauptknopf und Fokusring magenta. Ein Formular, das durchgehend
 * magenta auf schwarz staende, saehe aus wie die Seite – aber eine
 * Eingabemaske muss vor allem lesbar sein, und die Gestaltung der Seite
 * ist auf Plakatwirkung gebaut, nicht auf zwanzig Textfelder
 * untereinander. Die Marke steht hier an den Stellen, an die man klickt.
 */
const theme = buildLegacyTheme({
  '--brand-primary': BRAND.accent,
  '--default-button-primary-color': BRAND.accent,
  '--focus-color': BRAND.accent,
  '--main-navigation-color': BRAND.ink,
  '--main-navigation-color--inverted': BRAND.paper,
  '--state-info-color': BRAND.accent,
})

/** Dasselbe Feld mit dem N wie im Browser-Reiter der Seite. */
const icon = () => StudioIcon({color: BRAND.accent})

export default defineConfig({
  name: 'melody-factory',
  title: 'Melody Factory',
  basePath: studioBasePath,
  projectId,
  dataset,
  icon,
  theme,

  schema: {
    types: schemaTypes,
    // Einzeldatensaetze gehoeren nicht in «Neu anlegen» – es gibt sie ja schon.
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Beim Einzeldatensatz bleiben nur die Aktionen, die Sinn ergeben:
    // veroeffentlichen und Aenderungen verwerfen. Kein Loeschen, kein
    // Duplizieren – beides wuerde die Seite nur leer machen.
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },

  plugins: [
    structureTool({structure}),
    // Links das Formular, rechts die Seite. Wer tippt, sieht die
    // Aenderung sofort – und kann in der Seite auf einen Text klicken,
    // um im Formular an der richtigen Stelle zu landen.
    presentationTool({
      title: 'Vorschau',
      previewUrl: {
        initial: siteUrl,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      resolve: {
        // Jede Adresse der Seite haengt an genau einem Datensatz –
        // beides wird hier aneinandergebunden, damit die Vorschau nicht
        // erst fragen muss, was sie zeigen soll.
        mainDocuments: defineDocuments([
          {route: '/', filter: '_type == "eventPage" && _id == $id', params: {id: 'eventPage'}},
          {
            route: '/kalender',
            filter: '_type == "calendarPage" && _id == $id',
            params: {id: 'calendarPage'},
          },
        ]),
        locations: {
          // Wortmarke und Footer der Startseite stehen auch auf dem
          // Kalender – darum nennt das Studio hier beide Adressen.
          eventPage: defineLocations({
            message: 'Diese Inhalte erscheinen auf der Startseite und im Footer des Kalenders.',
            locations: [
              {title: 'Startseite', href: '/'},
              {title: 'Kalender', href: '/kalender'},
            ],
          }),
          calendarPage: defineLocations({
            message: 'Diese Inhalte erscheinen auf der Kalender-Seite.',
            locations: [{title: 'Kalender', href: '/kalender'}],
          }),
          // Farben, Logo und Schrift gelten ueberall – also nennt das
          // Studio hier alle drei Adressen.
          siteSettings: defineLocations({
            message: 'Diese Einstellungen gelten für alle Seiten.',
            locations: [
              {title: 'Startseite', href: '/'},
              {title: 'Kalender', href: '/kalender'},
              {title: 'Newsletter', href: '/newsletter'},
            ],
          }),
        },
      },
    }),
    // Die Oberflaeche selbst auf Deutsch – Schaltflaechen, Menues,
    // Fehlermeldungen. Der Kunde arbeitet deutsch, also tut das Studio es auch.
    deDELocale(),
    // Der GROQ-Spielplatz ist ein Werkzeug fuer die Entwicklung und hat im
    // Studio des Kunden nichts zu suchen.
    ...(isDev ? [visionTool({defaultApiVersion: apiVersion})] : []),
  ],
})
