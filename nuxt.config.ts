// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Needed for CSS `hyphens: auto` to actually hyphenate (browsers pick the
  // hyphenation dictionary from this) — see the page header title's own
  // mobile fix in Default.vue for a long French word that needed it.
  app: {
    head: {
      htmlAttrs: { lang: 'fr' }
    }
  },
  css: ['~/assets/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
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
