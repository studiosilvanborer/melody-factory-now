import {defineField, defineType} from 'sanity'

/**
 * Eine Zeile der Besetzung. Die Reihenfolge in der Liste ist die
 * Reihenfolge auf der Seite; die Seite bricht die Liste selbst auf die
 * beiden Spalten um – wer umsortiert, muss nichts weiter beachten.
 */
export const castMember = defineType({
  name: 'castMember',
  title: 'Mitwirkende Person',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Instrument / Funktion',
      type: 'string',
      description: 'z. B. «Violine», «Moderation & Gesang».',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
