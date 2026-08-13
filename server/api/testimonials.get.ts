import type { KqlTestimonial } from '~~/shared/types/kql'

interface RawTestimonyItem {
  testimony_item_role?: string[]
  testimony_item_photo?: string[]
  testimony_item_text?: string
}

interface RawTestimonialsPage {
  id: string
  items: RawTestimonyItem[] | null
  images: Array<{ filename: string; url: string; alt: string | null; width: number; height: number; extension: string }>
}

/**
 * The "testimonials" content block is intentionally empty in Kirby — like
 * "concerts-event", it's just an anchor. The real quotes live in the
 * "testimony_items" structure field on every page using the "testimonials"
 * template (site.yml lists this as a dedicated collection, e.g.
 * "témoignages"). We flatten across all matching pages so more than one
 * collection page can contribute quotes.
 */
export default defineEventHandler(async () => {
  const pages = await kqlFetch<RawTestimonialsPage[]>({
    query: 'site.index.filterBy("intendedTemplate", "testimonials")',
    select: {
      id: true,
      items: 'page.testimony_items',
      images: {
        query: 'page.images',
        select: FILE_SELECT
      }
    }
  })

  const testimonials: KqlTestimonial[] = (pages ?? []).flatMap((page) => {
    const items = page.items ?? []
    return items
      .filter(item => item.testimony_item_text)
      .map(item => ({
        role: item.testimony_item_role ?? [],
        text: item.testimony_item_text ?? '',
        photo: resolveKqlFile(item.testimony_item_photo, page.images)
      }))
  })

  return testimonials
})
