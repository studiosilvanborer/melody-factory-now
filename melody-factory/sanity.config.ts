'use client'

import {deDELocale} from '@sanity/locale-de-de'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId, siteUrl, studioBasePath} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schema'
import {singletonActions, singletonTypes, structure} from './src/sanity/structure'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  name: 'melody-factory',
  title: 'Melody Factory',
  basePath: studioBasePath,
  projectId,
  dataset,

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
