'use client'

import {useEffect} from 'react'

/**
 * Blendet die .reveal-Elemente ein, sobald sie im Viewport stehen.
 *
 * Bewusst kein IntersectionObserver: dessen Callbacks kommen ueber den
 * Rendering-Lifecycle und blieben in Tests vereinzelt ganz aus, womit die
 * letzten Elemente der Seite unsichtbar haengenblieben. Diese Pruefung
 * laeuft direkt und deckt den sichtbaren Bereich sicher ab.
 *
 * Der Startzustand (opacity: 0) haengt an .js-anim, und .js-anim setzt
 * erst dieser Effekt – also nach der Hydration. Drei Dinge folgen daraus,
 * und alle drei sind gewollt:
 *
 *  1. Ohne JavaScript bleibt die Seite unveraendert sichtbar.
 *  2. Bei prefers-reduced-motion passiert gar nichts.
 *  3. Die Klasse wird nicht vor React gesetzt, sondern nach ihm – sonst
 *     waere sie beim Hydrieren ein Unterschied zwischen Server-HTML und
 *     Client-Render, und React wuerde sie wieder entfernen.
 *
 * Was beim Laden schon im Bild steht, wird im selben Durchlauf auf
 * sichtbar gesetzt – es blitzt also nichts auf.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    let pending: Element[] = []
    let queued = false

    function check() {
      queued = false
      const h = window.innerHeight
      for (let i = pending.length - 1; i >= 0; i--) {
        const r = pending[i].getBoundingClientRect()
        if (r.top < h && r.bottom > 0) {
          pending[i].classList.add('is-in')
          pending.splice(i, 1)
        }
      }
      if (!pending.length) stopListening()
    }

    function schedule() {
      if (queued) return
      queued = true
      requestAnimationFrame(check)
    }

    function stopListening() {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', check)
    }

    try {
      root.classList.add('js-anim')
      pending = Array.from(document.querySelectorAll('.reveal'))
      window.addEventListener('scroll', schedule, {passive: true})
      window.addEventListener('resize', schedule, {passive: true})
      // zweiter direkter Durchlauf, wenn Bilder und Schriften stehen
      window.addEventListener('load', check)
      check()
    } catch {
      root.classList.remove('js-anim')
    }

    return () => {
      stopListening()
      root.classList.remove('js-anim')
    }
  }, [])

  return null
}
