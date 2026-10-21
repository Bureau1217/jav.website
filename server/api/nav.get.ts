import type { KqlNavItem } from '~~/shared/types/kql'

/**
 * The site nav (header burger menu + footer links) is generated from the
 * real page tree instead of a hardcoded list: every top-level page using
 * the "default" template, in the order editors drag them into in the
 * Panel. Unlisted/draft pages are excluded automatically by `.listed`.
 */
export default defineEventHandler(async () => {
  const pages = await kqlFetch<KqlNavItem[]>({
    query: 'site.children.listed.filterBy("intendedTemplate", "default")',
    select: {
      id: true,
      title: true,
      uri: 'page.uri'
    }
  })

  return pages ?? []
})
