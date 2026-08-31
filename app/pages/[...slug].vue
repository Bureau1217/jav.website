<template>
  <PagesDefault v-if="page && page.template === 'default'" :page="page" :is-home="path === ''" />
  <p v-else-if="page" class="v-page-unsupported">
    Le template « {{ page.template }} » n'est pas encore pris en charge.
  </p>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

const route = useRoute()
const path = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug.join('/') : ''
)

const { data: page, error } = await useFetch<KqlPage>(
  () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
  { key: () => `page:${path.value}` }
)

console.log(page)

// if (error.value) {
//   throw createError({
//     statusCode: error.value.statusCode ?? 500,
//     statusMessage: 'Page introuvable',
//     fatal: true
//   })
// }
</script>
