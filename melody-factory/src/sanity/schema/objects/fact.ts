import {defineField, defineType} from 'sanity'

/** Eine Zeile im Stil «Dauer · 1 Std. ohne Pause». */
export const fact = defineType({
  name: 'fact',
  title: 'Angabe',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Bezeichnung',
      type: 'string',
      description: 'Steht links, in Magenta – z. B. «Dauer».',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'value',
      title: 'Angabe',
      type: 'text',
      rows: 2,
      description: 'Steht rechts daneben.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
