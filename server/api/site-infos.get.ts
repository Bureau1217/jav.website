import type { KqlInfoBand } from '~~/shared/types/kql'

interface RawInfoBand {
  infos_bands_text?: string
  infos_bands_image?: string[]
  infos_bands_link?: string
}

interface RawSiteInfosPage {
  bands: RawInfoBand[] | null
  images: Array<{ filename: string; url: string; alt: string | null; width: number; height: number; extension: string }>
}

/**
 * The scrolling announcement banner and floating promo card both pull from
 * the "Infos-bands" structure on the site-wide "informations-globales"
 * page (template "site_infos" — see site.yml). Editors manage this from a
 * dedicated Panel section instead of a per-page block.
 */
export default defineEventHandler(async () => {
  const page = await kqlFetch<RawSiteInfosPage | null>({
    query: 'site.index.filterBy("intendedTemplate", "site_infos").first',
    select: {
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

  if (!page) {
    return [] as KqlInfoBand[]
  }

  const bands: KqlInfoBand[] = (page.bands ?? [])
    .filter(band => band.infos_bands_text)
    .map(band => ({
      text: band.infos_bands_text ?? '',
      image: resolveKqlFile(band.infos_bands_image, page.images),
      link: band.infos_bands_link || null
    }))

  return bands
})
