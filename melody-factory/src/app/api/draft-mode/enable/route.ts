import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/client'

/**
 * Schaltet die Vorschau ein. Angesprochen wird die Route nur von der
 * Vorschau im Studio; defineEnableDraftMode prueft dabei, ob der Aufruf
 * wirklich von dort kommt – ohne gueltigen Token geht nichts.
 */
export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token: process.env.SANITY_API_READ_TOKEN}),
})
