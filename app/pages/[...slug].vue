<template>
  <PagesDefault v-if="page && page.template === 'default'" :page="page" :is-home="path === ''" />
  <PagesEventItem v-else-if="page && page.template === 'event_item'" :page="page" />
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

// Per-page color theme (see usePageTheme.ts) — kept in shared state (not a
// local computed) because app.vue needs it too, to also retheme TheFooter,
// which lives outside this page's own component tree. Skipped for
// "event_item" pages: PagesEventItem.vue owns its own theme instead, since
// it depends on the event's position in the site-wide events list, not a
// fixed per-page id (see app/utils/eventPalette.ts).
const pageTheme = usePageTheme()
// See useFooterLeadBars.ts — true only when this page's last visible block
// is a Qualiopi block, so the footer picks up its two "signature" bars.
const footerLeadBars = useFooterLeadBars()
watch(() => page.value, (p) => {
  if (!p) return
  if (p.template === 'event_item') {
    // PagesEventItem.vue owns its own theme (see above); it never renders a
    // Qualiopi block either, so always clear a leftover true from whichever
    // default page was visited previously.
    footerLeadBars.value = false
    return
  }
  pageTheme.value = pageThemeFor(p.id)
  const visibleBlocks = (p.blocks ?? []).filter(block => !block.isHidden)
  footerLeadBars.value = visibleBlocks.at(-1)?.type === 'qualiopi'
}, { immediate: true })

// if (error.value) {
//   throw createError({
//     statusCode: error.value.statusCode ?? 500,
//     statusMessage: 'Page introuvable',
//     fatal: true
//   })
// }
</script>
