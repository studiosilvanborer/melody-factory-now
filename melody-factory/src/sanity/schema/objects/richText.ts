import {defineArrayMember, defineType} from 'sanity'

/**
 * Fliesstext, wie die Seite ihn kennt: Absaetze mit Auszeichnung, sonst
 * nichts. Keine Titel-Stile, keine Listen – die Typografie der Seite ist
 * fest gesetzt, und alles, was hier zusaetzlich waehlbar waere, koennte
 * das Layout nur kaputt machen.
 *
 * «Hervorgehoben» = <strong> (Infos-Text), «Kursiv» = <em> (Intro-Lead).
 */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Absatz', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Hervorgehoben', value: 'strong'},
          {title: 'Kursiv', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'Ziel',
                description:
                  'Vollstaendige Adresse (https://…), E-Mail (mailto:…) oder Sprungmarke (#programm).',
                validation: (rule) => rule.required(),
              },
            ],
          },
        ],
      },
    }),
  ],
})
