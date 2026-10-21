// Matomo audience measurement — loaded only in the browser, in the built
// site (never in `nuxt dev`, so local testing doesn't pollute the real
// statistics), and only while matomoUrl and matomoSiteId are both set (see
// nuxt.config.ts — defaults are JAV's own Matomo, overridable with
// NUXT_PUBLIC_MATOMO_URL / NUXT_PUBLIC_MATOMO_SITE_ID).
//
// Matches what the privacy policy says: no tracking cookie (disableCookies)
// and the visitor's opt-out is honored. IP anonymization and the 180-day
// raw-data retention are server-side settings in Matomo itself
// (Administration > Privacy), not something this script controls.
declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) return

  const { matomoUrl, matomoSiteId } = useRuntimeConfig().public
  if (!matomoUrl || !matomoSiteId) return

  const base = `${String(matomoUrl).replace(/\/+$/, '')}/`
  const paq = (window._paq = window._paq || [])

  paq.push(['disableCookies'])
  paq.push(['setTrackerUrl', `${base}matomo.php`])
  paq.push(['setSiteId', String(matomoSiteId)])
  paq.push(['enableLinkTracking'])

  const script = document.createElement('script')
  script.async = true
  script.src = `${base}matomo.js`
  document.head.appendChild(script)

  // The first page view is sent once the page is really rendered; every
  // later client-side navigation is a new page view too (the site is a SPA
  // after the first load, so Matomo wouldn't see them otherwise).
  let previousUrl = window.location.href
  paq.push(['trackPageView'])

  nuxtApp.hook('page:finish', () => {
    const url = window.location.href
    if (url === previousUrl) return
    paq.push(['setReferrerUrl', previousUrl])
    paq.push(['setCustomUrl', url])
    paq.push(['setDocumentTitle', document.title])
    paq.push(['trackPageView'])
    previousUrl = url
  })
})
