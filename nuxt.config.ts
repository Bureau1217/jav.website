// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'JAV - L’École des Musiques',
      // Each page builds its complete title itself (see usePageSeo.ts), so no
      // template is applied on top. (The previous value was a function called
      // immediately, i.e. one fixed string for every page.)
      titleTemplate: '%s',
      link: [
        // favicon-jav.png (provided, 100x100) — PNG favicons are supported
        // by every current browser, no .ico conversion needed; the old
        // generic Nuxt favicon.ico in public/ is left in place only as a
        // fallback for anything that still asks for /favicon.ico directly.
        { rel: 'icon', type: 'image/png', href: '/favicon-jav.png' },
        { rel: 'apple-touch-icon', href: '/favicon-jav.png' }
      ],
      meta: [
        { name: 'description', content: 'JAV, l’École des Musiques — centre de formation aux métiers du jazz et des musiques actuelles, certifié Qualiopi, à Valence.' },
        // Default site-wide Open Graph/Twitter card — a page can still
        // override title/description/image with its own useSeoMeta() call;
        // these are just the fallback whenever it doesn't.
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'JAV - L’École des Musiques' },
        { property: 'og:image', content: '/opengraph-jav.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/opengraph-jav.png' }
      ]
    }
  },
  css: ['~/assets/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // "as *" keeps every $variable/@mixin globally accessible with its
          // bare name (e.g. $breakpoint-mobile, @include type-label)
          // everywhere this gets injected, same as the old @import behavior
          // — without it, @use would namespace them (e.g. params.$breakpoint
          // -mobile) and every file using the bare name today would break.
          additionalData: '@use "~/assets/_params.scss" as *; @use "~/assets/_typo-mixins.scss" as *;'
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      // Canonical public origin (e.g. "https://www.jav-musiques.com"), used
      // for the sitemap's absolute URLs — set it with NUXT_PUBLIC_SITE_URL.
      // Empty falls back to whichever host the request came in on.
      siteUrl: '',
      // Matomo (audience measurement), JAV's own install. Neither value is a
      // secret (both end up in the page's public JS), so they live here as
      // defaults — no .env needed; NUXT_PUBLIC_MATOMO_URL /
      // NUXT_PUBLIC_MATOMO_SITE_ID still override them, and setting either to
      // an empty value turns tracking off. Never active in `nuxt dev` (see
      // app/plugins/matomo.client.ts).
      matomoUrl: 'https://matomo.jav-musiques.com',
      matomoSiteId: '1'
    },
    apiUrl: '',
    apiAuthEmail: '',
    apiAuthPassword: '',

    mailchimp: {
      apiKey: '',
      listId: ''
    },
    smtp: {
      host: 'mail.infomaniak.com',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: ''
      },
    }
  }
})
