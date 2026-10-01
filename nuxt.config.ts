// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'JAV - L’École des Musiques',
      titleTemplate: (title) => title ? `${title} - JAV` : 'JAV - L’École des Musiques',
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
          additionalData: '@import "~/assets/_params.scss"; @import "~/assets/_typo-mixins.scss";'
        }
      }
    }
  },
  runtimeConfig: {
    apiUrl: '',
    apiAuthEmail: '',
    apiAuthPassword: '',
    smtp: {
      host: 'mail.infomaniak.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@jav-musique.com',
        pass: 'motdepasse_exemple'
      },
    }
  }
})
