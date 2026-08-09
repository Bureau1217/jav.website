import type { KqlPage } from '~~/shared/types/kql'

export default defineEventHandler(async (event) => {
  const rawSlug = getRouterParam(event, 'slug') ?? ''
  const id = sanitizePageId(rawSlug)

  if (id === null) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page path' })
  }

  const page = await kqlFetch<KqlPage | null>({
    query: buildPageQuery(id),
    select: pageSelect
  })

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
