import type {Metadata, Viewport} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import type {ReactNode} from 'react'

import {DesignTokens, FontLinks} from '@/components/DesignTokens'
import {HeroParallaxFallback} from '@/components/HeroParallaxFallback'
import {MailerLite} from '@/components/MailerLite'
import {RevealOnScroll} from '@/components/RevealOnScroll'
import {resolveDesign} from '@/sanity/design'
import {siteUrl} from '@/sanity/env'
import {
  fetchEventPage,
  fetchSiteSettings,
  resolveFetchMode,
  SanityLive,
} from '@/sanity/live'
import {urlFor} from '@/sanity/image'
import type {EventPageData, SiteSettingsData} from '@/sanity/types'

import '@/styles/site.css'

/**
 * Titel, Beschreibung und Social-Vorschau kommen aus dem Studio – der
 * Kunde pflegt sie im Reiter «Suchmaschinen & Social», ohne dass jemand
 * Code anfassen muss. Das Zeichen im Browser-Reiter kommt aus dem
 * Datensatz «Gestaltung» und folgt damit der Akzentfarbe.
 */
export async function generateMetadata(): Promise<Metadata> {
  const mode = await resolveFetchMode()
  const [page, settings] = await Promise.all([
    fetchEventPage(mode) as Promise<EventPageData | null>,
    fetchSiteSettings(mode) as Promise<SiteSettingsData>,
  ])
  const design = resolveDesign(settings)

  if (!page) {
    return {
      title: 'Melody Factory',
      description: 'Inhalte werden noch gepflegt.',
      icons: {icon: design.faviconUrl},
    }
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
    icons: {icon: design.faviconUrl},
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

/**
 * Die Farbe, mit der mobile Browser ihre Leiste ueber der Seite
 * einfaerben – dieselbe Akzentfarbe wie die Seite selbst. Als Funktion
 * und nicht als Konstante, weil sie jetzt aus dem Studio kommt.
 */
export async function generateViewport(): Promise<Viewport> {
  const settings = (await fetchSiteSettings(await resolveFetchMode())) as SiteSettingsData
  return {themeColor: resolveDesign(settings).accent}
}

export default async function SiteLayout({children}: {children: ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const settings = (await fetchSiteSettings(await resolveFetchMode())) as SiteSettingsData
  const design = resolveDesign(settings)

  return (
    <>
      <FontLinks design={design} />
      <DesignTokens design={design} />

      <a className="skip-link" href="#programm">
        {design.skipLinkLabel}
      </a>

      {children}

      {/* Beide Skripte haengen an der Bewegung: eines blendet die
          Elemente ein, das andere laesst das Hero-Bild nachlaufen. Steht
          der Schalter im Studio auf aus, braucht es sie nicht – und ohne
          RevealOnScroll bekommt die Seite nie die Klasse .js-anim, mit
          der der Startzustand «unsichtbar» ueberhaupt erst gilt. */}
      {design.animations ? <RevealOnScroll /> : null}
      {design.animations && design.parallax ? <HeroParallaxFallback /> : null}

      <MailerLite accountId={design.mailerliteAccountId} />

      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode ? <VisualEditing /> : null}
    </>
  )
}
