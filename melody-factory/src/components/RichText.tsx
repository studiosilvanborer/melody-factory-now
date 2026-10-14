import {PortableText, type PortableTextComponents} from '@portabletext/react'

import {isExternal} from '@/lib/format'
import type {RichTextValue} from '@/sanity/types'

/**
 * Fliesstext aus Sanity.
 *
 * Jeder Absatz wird zu einem eigenen <p> mit der Klasse des Blocks – so
 * greifen Typografie und Einblend-Animation der Seite unveraendert. Mehr
 * als Absatz, fett, kursiv und Link kann das Schema nicht liefern, also
 * braucht es hier auch nicht mehr.
 */
export function RichText({
  value,
  className,
}: {
  value: RichTextValue | null | undefined
  className: string
}) {
  if (!value?.length) return null

  const components: PortableTextComponents = {
    block: {
      normal: ({children}) => <p className={`${className} reveal`}>{children}</p>,
    },
    marks: {
      link: ({children, value: mark}) => {
        const href: string = mark?.href ?? '#'
        return isExternal(href) ? (
          <a href={href} target="_blank" rel="noopener">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        )
      },
    },
  }

  return <PortableText value={value} components={components} />
}
