import {defineField, defineType} from 'sanity'

/**
 * Ein Footer-Link. Bewusst nur zwei Felder: Beschriftung und Ziel.
 * Ob der Link in einem neuen Tab aufgeht, entscheidet die Seite selbst
 * anhand des Ziels – externe Adressen ja, Sprungmarken und mailto nein.
 * Ein eigenes Ankreuzfeld dafuer waere eine Stolperstelle ohne Gewinn.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Beschriftung',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'href',
      title: 'Ziel',
      type: 'string',
      description:
        'https://… für externe Seiten, mailto:… für E-Mail, #programm für eine Stelle auf dieser Seite.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string') return 'Pflichtfeld'
          if (/^(https?:\/\/|mailto:|tel:|\/|#)/.test(value.trim())) return true
          return 'Bitte mit https://, mailto:, tel:, / oder # beginnen.'
        }),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
