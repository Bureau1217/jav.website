declare global {
  interface Window {
    _paq: string[][]
  }
}

export function matomo(base: string, matomoSiteId: string) {

  console.info('init matomo analytics')

  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["disableCookies"]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);

  (function() {
    _paq.push(['setTrackerUrl', base+'matomo.php']);
    _paq.push(['setSiteId', matomoSiteId]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=base+'matomo.js'; s!.parentNode?.insertBefore(g,s!);
  })();
}


export function updateMatomoWithNavigation(from: string, to: string) {
  console.log('hashchange', {
    pathnameFrom: from,
    pathnameTo: to,
    title: document.title,
  })
  window._paq.push(['setCustomUrl', to])
  window._paq.push(['setDocumentTitle', document.title])
  window._paq.push(['setReferrerUrl', from])
  window._paq.push(['trackPageView'])
}


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
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) return

  const { matomoUrl, matomoSiteId } = useRuntimeConfig().public
  if (!matomoUrl || !matomoSiteId) {
    console.error('Matomo disabled because matomoUrl or matomoSiteId is missing')
    return
  }

  matomo(matomoUrl, matomoSiteId)

  nuxtApp.$router.afterEach((to, from, failure) => {
    updateMatomoWithNavigation(from.fullPath, to.fullPath)
  })

})
