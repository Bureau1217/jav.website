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
const router = useRouter()
const path = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug.join('/') : ''
)

const { data: page, error } = await useFetch<KqlPage>(
  () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
  { key: () => `page:${path.value}` }
)

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

function applyPageChrome(p: KqlPage | null) {
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
}

// Applied two different ways on purpose. `page` resolves (via the awaited
// useFetch above) as soon as the new route's data is fetched — which, on a
// client-side navigation, happens *during* the transition, while the
// outgoing page's content is still the one on screen. A plain
// `watch(page, ...)` used to apply the new theme right then, so the
// header/footer switched color a beat before the visible page content did
// (a visible flash of mismatched colors). router.afterEach only fires once
// Vue Router has actually confirmed the navigation, so re-applying there
// lands the color change together with the new page instead of ahead of it.
// The one-time immediate call covers the very first page load, where
// afterEach never fires (no navigation happened) but there's also no
// previous page on screen to flash against.
applyPageChrome(page.value)
// router.afterEach registers on the global router instance, not on this
// component — it is NOT auto-removed when this component unmounts/re-runs
// setup (e.g. every Vite HMR reload of this file during dev). Without the
// explicit unregister below, each HMR pass stacks another listener that
// fires on every future navigation forever, for the rest of the dev
// session — growing CPU cost per navigation and leaking memory the longer
// you keep editing this file. router.afterEach() returns an unsubscribe
// function specifically for this.
const removeAfterEachHook = router.afterEach(() => {
  applyPageChrome(page.value)
})
onScopeDispose(removeAfterEachHook)

// if (error.value) {
//   throw createError({
//     statusCode: error.value.statusCode ?? 500,
//     statusMessage: 'Page introuvable',
//     fatal: true
//   })
// }
</script>
