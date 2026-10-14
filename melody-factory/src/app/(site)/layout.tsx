import type {Metadata, Viewport} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import type {ReactNode} from 'react'

import {HeroParallaxFallback} from '@/components/HeroParallaxFallback'
import {RevealOnScroll} from '@/components/RevealOnScroll'
import {siteUrl} from '@/sanity/env'
import {fetchEventPage, resolveFetchMode, SanityLive} from '@/sanity/live'
import {urlFor} from '@/sanity/image'
import type {EventPageData} from '@/sanity/types'

import '@/styles/site.css'

/** Magentafarbenes Feld mit dem N der Wortmarke. */
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23e4017e'/%3E%3Ctext x='16' y='24' font-family='Garamond,Georgia,serif' font-size='26' text-anchor='middle' fill='%23000'%3EN%3C/text%3E%3C/svg%3E"

export const viewport: Viewport = {
  themeColor: '#e4017e',
}

/**
 * Titel, Beschreibung und Social-Vorschau kommen aus dem Studio – der
 * Kunde pflegt sie im Reiter «Suchmaschinen & Social», ohne dass jemand
 * Code anfassen muss.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = (await fetchEventPage(await resolveFetchMode())) as EventPageData | null

  if (!page) {
    return {title: 'Melody Factory', description: 'Inhalte werden noch gepflegt.'}
  }

  const shareImage = page.shareImage?.asset
    ? urlFor(page.shareImage).width(1200).height(630).fit('crop').url()
    : page.heroImage?.asset
      ? urlFor(page.heroImage).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    metadataBase: new URL(siteUrl),
    title: page.metaTitle,
    description: page.metaDescription,
    icons: {icon: FAVICON},
    openGraph: {
      type: 'website',
      locale: 'de_CH',
      title: page.shareTitle || page.metaTitle,
      description: page.shareDescription || page.metaDescription,
      images: shareImage ? [{url: shareImage, width: 1200, height: 630}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.shareTitle || page.metaTitle,
      description: page.shareDescription || page.metaDescription,
      images: shareImage ? [shareImage] : undefined,
    },
  }
}

export default async function SiteLayout({children}: {children: ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <>
      {/* Myriad Pro (Typekit) und EB Garamond kommen als Stylesheet-Link,
          genau wie im Entwurf; React hebt die Tags in den <head>.
          next/font ist hier keine Option: das CSS der Seite spricht die
          Familien unter ihren echten Namen an («myriad-pro», «EB
          Garamond»), next/font vergibt aber generierte. Die Lint-Regel
          dagegen zielt auf den Pages Router und greift hier nicht. */}
      {/* eslint-disable @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://use.typekit.net/wgo3fee.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap"
      />
      {/* eslint-enable @next/next/no-page-custom-font */}

      <a className="skip-link" href="#programm">
        Zum Inhalt springen
      </a>

      {children}

      <RevealOnScroll />
      <HeroParallaxFallback />

      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode ? <VisualEditing /> : null}
    </>
  )
}
