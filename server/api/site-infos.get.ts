import type { KqlAddress, KqlFooterLegalLink, KqlInfoBand, KqlNavItem, KqlSiteInfo } from '~~/shared/types/kql'

interface RawAddress {
  name?: string
  street?: string
  number?: string
  postal_code?: string
  city?: string
}

interface RawInfoBand {
  infos_bands_text?: string
  infos_bands_image?: string[]
  infos_bands_link?: string
}

interface RawSiteInfosPage {
  adresse: RawAddress | null
  phone: string | null
  email: string | null
  footerPages: KqlNavItem[] | null
  socialInstagram: string | null
  socialFacebook: string | null
  socialYoutube: string | null
  footerLinkAccessibilite: string | null
  footerLinkTarifs: string | null
  footerLinkMentions: string | null
  footerLinkConfidentialite: string | null
  accessibilityText: string | null
  bands: RawInfoBand[] | null
  images: Array<{ filename: string; url: string; alt: string | null; width: number; height: number; extension: string }>
}

// The footer's 4 legal links, in display order — label is fixed (not
// editable, same reasoning as Formations.global.vue's own program headings),
// only each target page is picked in the Panel (see footerLinkAccessibilite
// etc. above). A null href after toRelativeLink below (no page picked yet)
// means that link just isn't shown — see TheFooter.vue.
const FOOTER_LEGAL_LINKS: Array<{ label: string, rawKey: keyof RawSiteInfosPage }> = [
  { label: 'Accessibilité', rawKey: 'footerLinkAccessibilite' },
  { label: 'Tarifs et Financement', rawKey: 'footerLinkTarifs' },
  { label: 'Mentions légales', rawKey: 'footerLinkMentions' },
  { label: 'Politique de confidentialité', rawKey: 'footerLinkConfidentialite' }
]

/**
 * Everything editors manage from "Informations globales" (site.yml ->
 * site_infos template): postal address, phone/fax/email, the editor-picked
 * list of pages to show in the footer nav ("Pages" field — deliberately
 * separate from /api/nav's auto-generated header list, so editors control
 * exactly what shows up in the footer), and the scrolling banner items.
 */
// .toUrl() (see the "bands" select below) resolves an internal page/file
// picked via the Panel's link picker into an ABSOLUTE url on the Kirby
// backend itself (e.g. "https://jav-admin.bureau1217.ch/evenements/...") —
// right path, wrong host, since the Nuxt front-end serves that same page
// under its own domain. Stripping the backend's own origin leaves a
// relative path the front-end's own router can resolve; a genuinely
// external link (a different domain the editor pasted directly) is left
// untouched.
function toRelativeLink(url: string | null, apiUrl: string): string | null {
  if (!url) return null
  try {
    const target = new URL(url, apiUrl)
    const base = new URL(apiUrl)
    return target.origin === base.origin ? `${target.pathname}${target.search}${target.hash}` : url
  } catch {
    return url
  }
}

// The scrolling banner's own picto is recolored client-side via CSS
// mask-image, to always follow the page's theme (TheScrollingBanner.vue)
// instead of showing its own uploaded colors — but mask-image needs to read
// the image's actual pixels, same as a <canvas>, so the browser enforces
// CORS on it even though a plain <img> wouldn't need it. Kirby's media
// server doesn't send Access-Control-Allow-Origin, so the browser silently
// refuses to load it as a mask. Inlining it as a data: URI server-side
// (a normal server-to-server fetch, not subject to browser CORS at all)
// sidesteps that entirely — the front-end never requests the remote file.
async function toDataUri(url: string | null): Promise<string | null> {
  if (!url) return null
  try {
    const response = await fetch(url)
    if (!response.ok) return url
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const buffer = Buffer.from(await response.arrayBuffer())
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return url
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const page = await kqlFetch<RawSiteInfosPage | null>({
    query: 'site.index.filterBy("intendedTemplate", "site_infos").first',
    select: {
      adresse: {
        query: 'page.adresse.toObject',
        select: {
          name: true,
          street: true,
          number: true,
          postal_code: true,
          city: true
        }
      },
      phone: 'page.phone_number',
      email: 'page.email',
      footerPages: {
        query: 'page.pages.toPages',
        select: {
          id: true,
          title: true,
          uri: 'page.uri'
        }
      },
      socialInstagram: 'page.social_instagram',
      socialFacebook: 'page.social_facebook',
      socialYoutube: 'page.social_youtube',
      // Each a native Kirby "link" field — same raw-value situation as
      // "infos_bands_link" below (page:// / file:// uuid refs, not real
      // URLs), so resolved the same way via .toUrl.
      footerLinkAccessibilite: 'page.footer_link_accessibilite.toUrl',
      footerLinkTarifs: 'page.footer_link_tarifs.toUrl',
      footerLinkMentions: 'page.footer_link_mentions.toUrl',
      footerLinkConfidentialite: 'page.footer_link_confidentialite.toUrl',
      accessibilityText: 'page.accessibility_text',
      bands: {
        query: 'page.infos_bands.toStructure',
        select: {
          infos_bands_text: 'structureItem.infos_bands_text',
          infos_bands_image: 'structureItem.infos_bands_image.toFiles.pluck("filename")',
          // "Lien du bandeau" is a native Kirby "link" field — when an
          // editor picks an internal page via the Panel's link picker, its
          // raw stored value is "page://<uuid>" (same for files, "file://
          // <uuid>"), not a real URL. .toUrl() resolves any of that (plus
          // bare external URLs, mailto:, tel:, anchors) into the actual
          // absolute URL — see Kirby's own Url::to()/components.php.
          infos_bands_link: 'structureItem.infos_bands_link.toUrl'
        }
      },
      images: {
        query: 'page.images',
        select: FILE_SELECT
      }
    }
  })

  const empty: KqlSiteInfo = {
    address: null,
    phone: null,
    email: null,
    footerPages: [],
    socialInstagram: null,
    socialFacebook: null,
    socialYoutube: null,
    footerLegalLinks: [],
    accessibilityText: null,
    bands: []
  }
  if (!page) {
    return empty
  }

  const bands: KqlInfoBand[] = await Promise.all((page.bands ?? [])
    .filter(band => band.infos_bands_text)
    .map(async (band) => {
      const image = resolveKqlFile(band.infos_bands_image, page.images)
      return {
        text: band.infos_bands_text ?? '',
        image: image ? { ...image, url: (await toDataUri(image.url)) ?? image.url } : null,
        link: toRelativeLink(band.infos_bands_link || null, config.apiUrl)
      }
    }))

  const address: KqlAddress | null = page.adresse
    ? {
        name: page.adresse.name || null,
        street: page.adresse.street || null,
        number: page.adresse.number || null,
        postalCode: page.adresse.postal_code || null,
        city: page.adresse.city || null
      }
    : null

  const footerLegalLinks: KqlFooterLegalLink[] = FOOTER_LEGAL_LINKS.map(({ label, rawKey }) => ({
    label,
    href: toRelativeLink((page[rawKey] as string | null) || null, config.apiUrl)
  }))

  const siteInfo: KqlSiteInfo = {
    address,
    phone: page.phone || null,
    email: page.email || null,
    footerPages: page.footerPages ?? [],
    socialInstagram: page.socialInstagram || null,
    socialFacebook: page.socialFacebook || null,
    socialYoutube: page.socialYoutube || null,
    footerLegalLinks,
    accessibilityText: page.accessibilityText || null,
    bands
  }

  return siteInfo
})
