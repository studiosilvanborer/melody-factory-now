import type {SchemaTypeDefinition} from 'sanity'

import {calendarPage} from './documents/calendarPage'
import {eventPage} from './documents/eventPage'
import {calendarEntry} from './objects/calendarEntry'
import {castMember} from './objects/castMember'
import {fact} from './objects/fact'
import {link} from './objects/link'
import {richText} from './objects/richText'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Dokumente
  eventPage,
  calendarPage,
  // Bausteine
  richText,
  link,
  fact,
  castMember,
  calendarEntry,
]
