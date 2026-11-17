import type {Design} from '@/sanity/design'

/**
 * Das Partnerlogo in der rechten oberen Ecke, gegenueber der Wortmarke.
 *
 * Breit statt hoch; die Breite waechst mit --k wie alles andere im Hero
 * und steht als Zahl im Studio (siehe --partner-logo-w in site.css).
 *
 * Die Farbe steckt in der Datei: hinterlegt wird eine Fassung in der
 * Akzentfarbe mit durchsichtigem Hintergrund. Auf der magentafarbenen
 * Flaeche faerbt .subhead .partner-logo sie per filter schwarz um – so
 * bleibt es bei einer Datei fuer beide Flaechen.
 *
 * Kein next/image: die Datei liegt entweder fertig in /public oder schon
 * auf dem Sanity-CDN, das Format und Groesse selbst aushandelt.
 *
 * `show` ist der Schalter einer einzelnen Seite – der Kalender hat einen
 * eigenen in seinem Reiter «Seitenkopf». Er kann das Logo nur
 * wegnehmen, nicht hinzufuegen: steht es unter «Gestaltung» auf aus,
 * bleibt es ueberall weg.
 */
export function PartnerLogo({
  design,
  className,
  show = true,
}: {
  design: Design
  className?: string
  show?: boolean
}) {
  const logo = design.partnerLogo

  if (!logo.show || !show) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className ? `partner-logo ${className}` : 'partner-logo'}
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
    />
  )
}
