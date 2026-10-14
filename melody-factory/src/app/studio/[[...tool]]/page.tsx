import {NextStudio} from 'next-sanity/studio'

import config from '../../../../sanity.config'

/**
 * Die Pflege-Oberflaeche, eingebettet in die Seite: erreichbar unter
 * /studio, auf derselben Domain. Ein Deploy, eine Adresse – der Kunde
 * muss sich nur eine merken.
 */
export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
