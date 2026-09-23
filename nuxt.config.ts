// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
    apiAuthPassword: ''
  }
})
