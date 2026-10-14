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
    labelDuration,
    labelVenue,
    labelAdditionalInfo,
    additionalFacts[]{label, value},

    castTitle,
    cast[]{role, name},

    infosTitle,
    infosText,
    infosOutro,

    trailerTitle,
    trailerUrl,
    trailerPlaceholder,

    footerLinkColumns[]{links[]{label, href}},
    ctaTitle,
    footerWordmark,
    footerLegal,

    metaTitle,
    metaDescription,
    shareTitle,
    shareDescription,
    shareImage{asset->{_id, url}}
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

    metaTitle,
    metaDescription
  }
`)
