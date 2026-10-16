import type { KqlPage } from '~~/shared/types/kql'

const SITE_NAME = 'JAV - L’École des Musiques'
const SITE_SUFFIX = 'JAV'

// Last-resort values — only used when neither the page nor "Informations
// globales" (Panel) provides its own.
const FALLBACK_DESCRIPTION
  = 'JAV, l’École des Musiques — centre de formation aux métiers du jazz et des musiques actuelles, certifié Qualiopi, à Valence.'
const FALLBACK_IMAGE_PATH = '/opengraph-jav.png'

/**
 * Every SEO tag of a Kirby page, in one place — title, description, canonical
 * URL, Open Graph / Twitter card. Call it once from the page component
 * ([...slug].vue) with the fetched page.
 *
 * What an editor fills in the Panel ("SEO" tab) wins; each field
 * has a sensible fallback so a page is never left without tags:
 * - title: SEO title → header title → page title, then " - JAV"
 *   (the home page uses the full site name instead, no suffix)
 * - description: SEO description → event description (cut to ~160 chars) →
 *   header subtitle → site-wide default ("Informations globales") → built-in
 * The Open Graph / Twitter share image is the same for every page: the one
 * set in "Informations globales", else /opengraph-jav.png.
 * Image and canonical URLs are made absolute (Open Graph requires it), based
 * on NUXT_PUBLIC_SITE_URL when set, else the request's own origin.
 */
export function usePageSeo(page: Ref<KqlPage | null | undefined>) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const requestUrl = useRequestURL()
  const { data: siteInfo } = useSiteInfo()

  const origin = computed(() => (config.public.siteUrl || requestUrl.origin).replace(/\/+$/, ''))

  function absolute(url: string | null | undefined) {
    if (!url) return null
    return /^https?:\/\//i.test(url) ? url : `${origin.value}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const isHome = computed(() => route.path === '/' || page.value?.id === 'home')

  const title = computed(() => {
    const p = page.value
    const own = p?.seoTitle || (isHome.value ? '' : (p?.headerTitle || p?.title))
    if (!own) return SITE_NAME
    return isHome.value ? own : `${own} - ${SITE_SUFFIX}`
  })

  const description = computed(() => {
    const p = page.value
    return (
      p?.seoDescription
      || truncateText(p?.eventDescription, 160)
      || p?.headerSubtitle
      || siteInfo.value?.seoDescription
      || FALLBACK_DESCRIPTION
    )
  })

  const image = computed(() => absolute(siteInfo.value?.seoImage || FALLBACK_IMAGE_PATH))

  // Trailing slash dropped (except the root), so "/agenda" and "/agenda/"
  // don't count as two different pages for search engines.
  const canonical = computed(() => {
    const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path
    return `${origin.value}${path}`
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    ogUrl: () => canonical.value,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    ogLocale: 'fr_FR',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value
  })

  useHead({
    link: [{ rel: 'canonical', href: () => canonical.value }]
  })
}
