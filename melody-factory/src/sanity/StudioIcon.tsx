/**
 * Das Zeichen des Arbeitsbereichs im Studio – dasselbe magentafarbene
 * Feld mit dem N wie das Zeichen im Browser-Reiter der Seite.
 *
 * Als eigene Datei und nicht in sanity.config.ts, weil die Konfiguration
 * eine .ts-Datei ist und darin kein JSX stehen darf. Die Farbe kommt als
 * Eigenschaft herein, damit die Konfiguration die eine Stelle bleibt, an
 * der sie steht.
 */
export function StudioIcon({color = '#e4017e'}: {color?: string}) {
  return (
    <svg viewBox="0 0 32 32" width="1em" height="1em" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill={color} />
      <text
        x="16"
        y="24"
        fontFamily="Garamond, Georgia, serif"
        fontSize="26"
        textAnchor="middle"
        fill="#000"
      >
        N
      </text>
    </svg>
  )
}
