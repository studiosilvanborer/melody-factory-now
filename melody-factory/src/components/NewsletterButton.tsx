'use client'

import {useSyncExternalStore} from 'react'

import {MAILERLITE_FORM_ID} from '@/lib/mailerlite'

/* Nichts zu abonnieren: der Wert wechselt genau einmal, von der
   Server-Antwort zur Hydration. Die Funktionen stehen hier draussen,
   damit sie stabil bleiben – React vergleicht sie bei jedem Render. */
const noSubscribe = () => () => {}
const onClient = () => true
const onServer = () => false

/**
 * Ruft das MailerLite-Formular von Hand auf – der zweite Weg neben dem
 * Pop-up, das von allein kommt.
 *
 * Das Snippet von MailerLite steht dort als onclick="ml('show', …)" im
 * HTML. So geht es in React nicht: onclick als Attribut wird nicht
 * ausgefuehrt, und ml lebt auf window, nicht im Modul. Darum ein echter
 * Handler in einer Client-Komponente – dieselbe Wirkung, nur auf dem
 * Weg, den React kennt.
 *
 * Gezeigt wird der Knopf erst nach der Hydration. Ohne JavaScript kann
 * er nichts tun, und ein Knopf, der auf einen Klick nicht reagiert, ist
 * schlimmer als keiner. Dieselbe Ueberlegung wie bei RevealOnScroll: was
 * an JavaScript haengt, erscheint erst, wenn JavaScript da ist.
 *
 * Die Klasse kommt von aussen, weil derselbe Knopf an zwei Stellen in
 * zwei Gestalten steht: im Footer als schlichte Zeile (cta__newsletter),
 * auf /newsletter als Pille (btn). Zwei Komponenten dafuer waeren zwei
 * Stellen, an denen derselbe Aufruf von Hand stimmen muesste.
 *
 * useSyncExternalStore und nicht ein Zustand im Effect: React liest beim
 * Rendern auf dem Server onServer, nach der Hydration onClient, und
 * rendert von selbst neu. Ein setState im Effect taete dasselbe, loest
 * aber eine zweite Renderrunde aus – die Lint-Regel
 * react-hooks/set-state-in-effect zeigt genau darauf.
 */
export function NewsletterButton({
  label,
  className = 'cta__newsletter',
}: {
  label: string
  className?: string
}) {
  const ready = useSyncExternalStore(noSubscribe, onClient, onServer)

  if (!ready) return null

  return (
    <button
      type="button"
      className={className}
      onClick={() => window.ml?.('show', MAILERLITE_FORM_ID, true)}
    >
      {label}
    </button>
  )
}
