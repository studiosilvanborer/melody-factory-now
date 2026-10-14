import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

/**
 * Baut die Bild-URL auf dem Sanity-CDN. `auto('format')` liefert WebP
 * oder AVIF, wo der Browser es kann, `fit('max')` skaliert nie hoch.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}
