/**
 * Die Werte, die Studio und Seite brauchen, um dasselbe Sanity-Projekt
 * anzusprechen.
 *
 * Jeder Wert wird unter zwei Namen gesucht, weil zwei Bundler ihn
 * einsetzen und jeder nur sein eigenes Praefix durchreicht:
 *
 *   NEXT_PUBLIC_*    – Next.js, fuer die Seite und das eingebettete Studio
 *   SANITY_STUDIO_*  – die Sanity-CLI, fuer `sanity build` / `sanity deploy`
 *
 * Beide muessen woertlich dastehen: Bundler ersetzen `process.env.FOO`
 * beim Bauen durch den Wert und erkennen einen dynamischen Zugriff wie
 * `process.env[name]` nicht. Was der jeweils andere Bundler nicht kennt,
 * wird zu `undefined` – und das `||` greift zum richtigen.
 */
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID,
  'Projekt-ID fehlt – NEXT_PUBLIC_SANITY_PROJECT_ID oder SANITY_STUDIO_PROJECT_ID setzen, siehe .env.example',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
  'Dataset fehlt – NEXT_PUBLIC_SANITY_DATASET oder SANITY_STUDIO_DATASET setzen, siehe .env.example',
)

/**
 * Datum als Versionsnummer: Sanity friert das API-Verhalten auf diesen Tag
 * ein. Nicht ohne Grund hochdrehen.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2026-10-14'

/** Adresse der Seite – fuer die Vorschau im Studio und fuer absolute Social-Links. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SANITY_STUDIO_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

/**
 * Unter welchem Pfad das Studio laeuft.
 *
 * In der Next.js-App ist das `/studio`. Beim Hosting auf
 * *.sanity.studio liegt es dagegen auf der Wurzel – sonst suchte es
 * seine eigenen Dateien unter /studio/… und faende nichts.
 */
export const studioBasePath = process.env.SANITY_STUDIO_BASEPATH || '/studio'

function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === '') throw new Error(errorMessage)
  return value
}
