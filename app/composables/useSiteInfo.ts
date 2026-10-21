import type { KqlSiteInfo } from '~~/shared/types/kql'

/**
 * Shared data source for "Informations globales" (address, contact,
 * footer pages, scrolling banner) — same key everywhere so the scrolling
 * banner and the footer don't each fire their own request.
 */
export function useSiteInfo() {
  return useFetch<KqlSiteInfo>('/api/site-infos', { key: 'site-infos' })
}
