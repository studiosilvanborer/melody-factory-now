import {defineQuery} from 'next-sanity'

/**
 * Eine Abfrage fuer die ganze Seite. Ein Einseiter braucht keine zweite:
 * ein Rundgang zum Server, und alles ist da.
 */
export const EVENT_PAGE_QUERY = defineQuery(`
  *[_type == "eventPage" && _id == "eventPage"][0]{
    heroImage{..., alt, asset->{_id, url, metadata{lqip, dimensions}}},
    logoText,
    claimLine1,
    claimLine2,
    claimLanguage,
    productionTitle,
    calendarLabel,
    wordmark,

    startsAt,
    venueShort,
    city,
    venueFull,
    duration,
    additionalInfo,
    ticketUrl,
    ticketLabel,

    introTitle,
    introLead,

    factsTitle,
    labelDate,
    labelDuration,
    labelVenue,
    labelAdditionalInfo,
    additionalFacts[]{label, value},

    castTitle,
    cast[]{role, name},

    infosTitle,
    infosText,
    infosOutro,

    showTrailer,
    trailerTitle,
    trailerVideo{asset->{_id, url, mimeType}},
    trailerUrl,
    trailerPlaceholder,

    footerLinkColumns[]{links[]{label, href}},
    ctaTitle,
    newsletterLabel,
    footerWordmark,
    footerLegal,

    newsletterTitle,
    newsletterLead,

    metaTitle,
    metaDescription,
    shareTitle,
    shareDescription,
    shareImage{asset->{_id, url}}
  }
`)

/**
 * Die Gestaltung – Farben, Logos, Schrift, Bewegung, die Saetze der
 * Oberflaeche.
 *
 * Eigene Abfrage und eigener Datensatz, weil sie auf jeder Seite gilt:
 * Startseite, Kalender und Newsletter fragen dieselben Werte ab. Jedes
 * Feld darf leer sein – was fehlt, ersetzt src/sanity/design.ts durch
 * den Entwurfswert.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    accentColor,
    inkColor,
    hoverColor,
    faviconLetter,
    faviconImage{asset->{_id, url}},

    partnerLogo{..., alt, asset->{_id, url, metadata{dimensions}}},
    showPartnerLogo,
    partnerLogoWidth,
    partnerLogoWidthMobile,

    fontSerif,
    fontSans,
    fontStylesheets,

    heroFocusX,
    heroFocusY,
    heroFocusXMobile,
    heroFocusYMobile,
    heroScrim,

    enableAnimations,
    enableParallax,

    skipLinkLabel,
    footerNavLabel,
    newsletterNoscript,
    calendarTicketContext,

    mailerliteAccountId,
    mailerliteFormId
  }
`)

/**
 * Die Kalender-Seite. Eigene Abfrage statt eines Felds auf der
 * Startseite: die Startseite braucht die Terminliste nicht, und der
 * Kalender braucht von der Startseite nur Wortmarke und Footer.
 */
export const CALENDAR_PAGE_QUERY = defineQuery(`
  *[_type == "calendarPage" && _id == "calendarPage"][0]{
    title,
    entries[]{startsAt, venue, production, ticketUrl, ticketLabel},
    emptyText,

    logoText,
    logoHref,
    showPartnerLogo,

    metaTitle,
    metaDescription
  }
`)
