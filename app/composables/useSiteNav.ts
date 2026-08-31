import type { KqlNavItem } from '~~/shared/types/kql'

/**
 * Shared data source for the header and footer nav — both call this with
 * the same key, so Nuxt dedupes it into a single request/cache entry
 * instead of fetching the page list twice per render.
 */
export function useSiteNav() {
  return useFetch<KqlNavItem[]>('/api/nav', { key: 'site-nav' })
}
