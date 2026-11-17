import {designCss, type Design} from '@/sanity/design'

/**
 * Die Gestaltung aus dem Studio als Stylchen im <head>.
 *
 * Es steht genau eine Regel darin – die Custom Properties, die site.css
 * ohnehin schon benutzt – plus die beiden Ausnahmen fuer abgeschaltete
 * Bewegung. Kein Inline-Style an den Elementen: die Werte gelten
 * seitenweit, und am Element wuerde jeder von ihnen jede Regel des
 * Stylesheets ueberstimmen, auch die, die gar nicht gemeint war.
 *
 * `href` und `precedence` sagen React, dass dieses Stylchen in den <head>
 * gehoert und dort nur einmal vorkommen soll – auch wenn mehrere Seiten
 * es rendern.
 */
export function DesignTokens({design}: {design: Design}) {
  return (
    <style href="melody-factory-design" precedence="high">
      {designCss(design)}
    </style>
  )
}

/** Die Stylesheets der Webfonts, wie sie im Studio hinterlegt sind. */
export function FontLinks({design}: {design: Design}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* Die Schriften kommen als Stylesheet-Link, genau wie im Entwurf;
          React hebt die Tags in den <head>. next/font ist hier keine
          Option: das CSS der Seite spricht die Familien unter ihren echten
          Namen an («myriad-pro», «EB Garamond»), next/font vergibt aber
          generierte. Und seit die Adressen aus dem Studio kommen, waere
          next/font ohnehin ausgeschlossen – es loest sie beim Bauen auf,
          nicht beim Abrufen. */}
      {design.fontStylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  )
}
