import type { KqlAddress, KqlInfoBand, KqlNavItem, KqlSiteInfo } from '~~/shared/types/kql'

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
  fax: string | null
  email: string | null
  footerPages: KqlNavItem[] | null
  bands: RawInfoBand[] | null
  images: Array<{ filename: string; url: string; alt: string | null; width: number; height: number; extension: string }>
}

/**
 * Everything editors manage from "Informations globales" (site.yml ->
 * site_infos template): postal address, phone/fax/email, the editor-picked
 * list of pages to show in the footer nav ("Pages" field — deliberately
 * separate from /api/nav's auto-generated header list, so editors control
 * exactly what shows up in the footer), and the scrolling banner items.
 */
export default defineEventHandler(async () => {
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
      fax: 'page.fax',
      email: 'page.email',
      footerPages: {
        query: 'page.pages.toPages',
        select: {
          id: true,
          title: true,
          uri: 'page.uri'
        }
      },
      bands: {
        query: 'page.infos_bands.toStructure',
        select: {
          infos_bands_text: 'structureItem.infos_bands_text',
          infos_bands_image: 'structureItem.infos_bands_image.toFiles.pluck("filename")',
          infos_bands_link: 'structureItem.infos_bands_link'
        }
      },
      images: {
        query: 'page.images',
        select: FILE_SELECT
      }
    }
  })

  const empty: KqlSiteInfo = { address: null, phone: null, fax: null, email: null, footerPages: [], bands: [] }
  if (!page) {
    return empty
  }

  const bands: KqlInfoBand[] = (page.bands ?? [])
    .filter(band => band.infos_bands_text)
    .map(band => ({
      text: band.infos_bands_text ?? '',
      image: resolveKqlFile(band.infos_bands_image, page.images),
      link: band.infos_bands_link || null
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

  const siteInfo: KqlSiteInfo = {
    address,
    phone: page.phone || null,
    fax: page.fax || null,
    email: page.email || null,
    footerPages: page.footerPages ?? [],
    bands
  }

  return siteInfo
})
