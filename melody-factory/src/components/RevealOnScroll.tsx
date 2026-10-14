'use client'

import {usePathname} from 'next/navigation'
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
 *
 * Der Pfad gehoert in die Abhaengigkeiten, weil diese Komponente im
 * Layout sitzt und einen Seitenwechsel ueberlebt. Ohne ihn stammte die
 * Liste `pending` fuer immer von der Seite, auf der die Komponente
 * einmal montiert wurde: nach dem Klick auf «Kalender» blieb .js-anim
 * auf dem <html> stehen, die neuen .reveal-Elemente bekamen nie ihr
 * .is-in – und die Terminliste war unsichtbar, bis man neu lud.
 */
export function RevealOnScroll() {
  const pathname = usePathname()

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
  }, [pathname])

  return null
}
