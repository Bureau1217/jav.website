// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/base.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@import "~/assets/_tokens.scss";'
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
