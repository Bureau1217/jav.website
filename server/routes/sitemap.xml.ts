import type { SitemapEntry } from '../utils/sitemap'

interface SitemapPage {
  id: string
  template: string
  modified: string | null
}

// Templates the front-end actually renders (see app/pages/[...slug].vue).
// Everything else in the Kirby tree — the "testimonials"/"teachers"/"teacher"
// data collections, "site_infos" — has no page of its own on the site, so
// listing it would hand Google URLs that 404.
const PUBLIC_TEMPLATES = ['default', 'event_item']

// Pages that exist on the site but should stay out of the sitemap, by Kirby
// page id.
const EXCLUDED_IDS = [
  'formation-professionnelle/details',
  // Legal pages: public and findable by Google (they're linked from every
  // page's footer, and not marked noindex), but deliberately left out of the
  // sitemap so they aren't put forward alongside the site's main pages.
  'mentions-legales',
  'politique-de-confidentialite'
]

/**
 * Builds the site's own URL from the live request (host + protocol, honoring
 * a reverse proxy's X-Forwarded-* headers) unless NUXT_PUBLIC_SITE_URL is
 * set — in that case that value wins, which pins the canonical domain
 * regardless of which hostname a request happened to come in on (e.g. the
 * hosting provider's own temporary preview domain).
 */
function siteOrigin(event: Parameters<typeof getRequestURL>[0]): string {
  const configured = useRuntimeConfig(event).public.siteUrl as string
  if (configured) return configured.replace(/\/+$/, '')
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true })
  return url.origin
}

// Importance by page, as the site owner ranked them: home first, then the
// two training offers, then the agenda and "à propos". Keyed by Kirby page
// id. Any page not listed here (e.g. "ressources" once it's published, or a
// new sub-page) falls back to a medium default below.
const PAGE_PRIORITY: Record<string, { priority: number, changefreq: SitemapEntry['changefreq'] }> = {
  'home': { priority: 1.0, changefreq: 'weekly' },
  'formation-professionnelle': { priority: 0.9, changefreq: 'monthly' },
  'pratique-amateur': { priority: 0.9, changefreq: 'monthly' },
  // The agenda lists every upcoming event, so it changes far more often.
  'agenda': { priority: 0.8, changefreq: 'weekly' },
  'a-propos': { priority: 0.7, changefreq: 'monthly' },
  // Still a draft — only appears in the sitemap once published in the Panel
  // (drafts are never part of site.index). If the page ends up with another
  // slug, change this key to match.
  'ressources': { priority: 0.8, changefreq: 'monthly' }
}

function entryFor(page: SitemapPage): SitemapEntry {
  const isEvent = page.template === 'event_item'
  const known = PAGE_PRIORITY[page.id]

  return {
    loc: page.id === 'home' ? '/' : `/${page.id}`,
    lastmod: page.modified ?? undefined,
    // Events are indexed but deliberately the lowest tier: the pages that
    // matter most (above) should win in a crawler's attention budget.
    changefreq: known?.changefreq ?? 'monthly',
    priority: known?.priority ?? (isEvent ? 0.4 : 0.6)
  }
}

export default defineCachedEventHandler(async (event) => {
  // Every published page in the Kirby tree (drafts are never part of
  // site.index), narrowed to the templates the front-end renders. "modified"
  // feeds <lastmod> so crawlers can skip pages that haven't changed.
  const pages = await kqlFetch<SitemapPage[] | null>({
    query: 'site.index',
    select: {
      id: true,
      template: 'page.intendedTemplate',
      modified: 'page.modified("Y-m-d")'
    }
  })

  const entries = (pages ?? [])
    .filter(page => PUBLIC_TEMPLATES.includes(page.template) && !EXCLUDED_IDS.includes(page.id))
    .map(entryFor)
    // Home first, then alphabetical — stable output between refreshes.
    .sort((a, b) => (a.loc === '/' ? -1 : b.loc === '/' ? 1 : a.loc.localeCompare(b.loc)))

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return buildSitemapXML(siteOrigin(event), entries)
}, {
  // Re-read from Kirby at most once an hour — crawlers hit this URL often,
  // and each uncached call is a full page-tree query. Keyed by host so a
  // request on one hostname never serves URLs built for another.
  // No caching in dev, so edits here (or to pages in the CMS) show up on
  // the next reload instead of up to an hour later. (maxAge: 0 alone wasn't
  // enough: Nitro's default stale-while-revalidate kept serving an old cached
  // copy, e.g. one built before a page was published.)
  maxAge: 60 * 60,
  swr: false,
  shouldBypassCache: () => import.meta.dev,
  getKey: event => getRequestHost(event, { xForwardedHost: true })
})
