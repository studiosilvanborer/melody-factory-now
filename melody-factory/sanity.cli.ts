import {defineCliConfig} from 'sanity/cli'

import {dataset, projectId} from './src/sanity/env'

/**
 * Nur fuer die Sanity-CLI (`sanity schema`, `sanity typegen`,
 * `sanity deploy`). Die Seite und das eingebettete Studio lesen ihre
 * Werte aus src/sanity/env.ts, nicht von hier.
 */
export default defineCliConfig({
  api: {projectId, dataset},
  deployment: {
    // Kennung des bei Sanity gehosteten Studios. Ohne sie fragt jedes
    // `sanity deploy` erneut nach, welche Anwendung gemeint ist.
    appId: 'fcty2bm7pvyitn216z5j46b7',
    // Das Studio holt sich Sanity-Updates selbst, statt auf einen
    // neuen Build zu warten.
    autoUpdates: true,
  },
  // Adresse des bei Sanity gehosteten Studios: melody-factory.sanity.studio
  studioHost: 'melody-factory',
})
