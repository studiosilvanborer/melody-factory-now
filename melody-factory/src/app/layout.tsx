import type {ReactNode} from 'react'

/**
 * Die Wurzel fuer beides – Seite und Studio. Absichtlich leer: alles,
 * was nur die Seite betrifft (Schriften, CSS, Skripte, Metadaten),
 * steht in src/app/(site)/layout.tsx und belastet das Studio nicht.
 */
export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
