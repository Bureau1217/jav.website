import type { KqlFormationCard } from '~~/shared/types/kql'

/**
 * The "formations" Kirby block has no editable fields — it's a fixed
 * anchor that always highlights these two specific pages. Their card tag
 * (Header-title), headline (Header-subtitle) and image (Page-image-preview,
 * the field Kirby's own default.yml describes as "shown when this page is
 * called from another page") come straight from each page's own header, so
 * editing either page's header updates the homepage card automatically.
 */
const FORMATION_URIS = ['formation-professionnelle', 'pratique-amateur']

export default defineEventHandler(async () => {
  const cards = await Promise.all(
    FORMATION_URIS.map(uri =>
      kqlFetch<KqlFormationCard | null>({
        query: `page("${uri}")`,
        select: {
          id: true,
          uri: 'page.uri',
          headerTitle: 'page.header_title',
          headerSubtitle: 'page.header_subtitle',
          previewImage: {
            query: 'page.page_image_preview.toFile',
            select: FILE_SELECT
          }
        }
      })
    )
  )

  return cards.filter((card): card is KqlFormationCard => card !== null)
})
