import type { KqlFile, KqlTestimonial } from '~~/shared/types/kql'

interface RawTestimonyItem {
  testimony_item_name?: string
  // Kirby's "tags" field stores its raw value as a single comma-separated
  // string (not an array) — same as every other tags field in this codebase
  // (Cartels, ArrayLayout's puce tags...), split below.
  testimony_item_role?: string
  testimony_item_text?: string
  testimony_item_photo?: KqlFile | null
}

interface RawTestimonialsPage {
  id: string
  items: RawTestimonyItem[] | null
}

/**
 * The "testimonials" content block is intentionally empty in Kirby — like
 * "concerts-event", it's just an anchor. The real quotes live in the
 * "testimony_items" structure field on every page using the "testimonials"
 * template (site.yml lists this as a dedicated collection, e.g.
 * "témoignages"). We flatten across all matching pages so more than one
 * collection page can contribute quotes.
 *
 * "page.testimony_items" alone returns the field's raw (unparsed) value —
 * .toStructure is what turns it into an actual iterable list of rows, same
 * pattern as every other structure field in kqlPageQuery.ts (itemImages,
 * resourceFiles...). Each row's own photo is resolved straight to a file
 * via structureItem.*.toFile (picked from anywhere on the site, not just
 * this page's own files — same reasoning as those other structures).
 */
export default defineEventHandler(async () => {
  const pages = await kqlFetch<RawTestimonialsPage[]>({
    query: 'site.index.filterBy("intendedTemplate", "testimonials")',
    select: {
      id: true,
      items: {
        query: 'page.testimony_items.toStructure',
        select: {
          testimony_item_name: true,
          testimony_item_role: true,
          testimony_item_text: true,
          testimony_item_photo: {
            query: 'structureItem.testimony_item_photo.toFile',
            select: FILE_SELECT
          }
        }
      }
    }
  })

  const testimonials: KqlTestimonial[] = (pages ?? []).flatMap((page) => {
    const items = page.items ?? []
    return items
      .filter(item => item.testimony_item_text)
      .map(item => ({
        name: item.testimony_item_name ?? '',
        role: (item.testimony_item_role ?? '').split(',').map(role => role.trim()).filter(Boolean),
        text: item.testimony_item_text ?? '',
        photo: item.testimony_item_photo ?? null
      }))
  })

  return testimonials
})
