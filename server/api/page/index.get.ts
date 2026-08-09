import type { KqlPage } from '~~/shared/types/kql'

export default defineEventHandler(async () => {
  const page = await kqlFetch<KqlPage | null>({
    query: buildPageQuery(''),
    select: pageSelect
  })

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
