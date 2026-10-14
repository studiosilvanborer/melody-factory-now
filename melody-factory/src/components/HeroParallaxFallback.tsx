'use client'

import {useEffect} from 'react'

/**
 * Rueckfall fuer Browser ohne scroll-getriebene Animationen (Firefox,
 * aeltere Safari). Liest nur scrollY und schreibt nur transform – beides
 * ohne Layout-Zwang, gebuendelt ueber requestAnimationFrame.
 */
export function HeroParallaxFallback() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const heroBg = document.querySelector<HTMLElement>('.hero__bg')
    if (!heroBg) return

    const factor = 0.18 // muss zu --parallax passen
    let queued = false

    function update() {
      queued = false
      const y = Math.min(window.scrollY, window.innerHeight) * factor
      heroBg!.style.transform = `translate3d(0,${y}px,0)`
    }

    function onScroll() {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }

    heroBg.style.willChange = 'transform'
    window.addEventListener('scroll', onScroll, {passive: true})
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      heroBg.style.willChange = ''
      heroBg.style.transform = ''
    }
  }, [])

  return null
}
