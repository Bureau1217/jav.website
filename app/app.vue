<template>
  <div class="v-app u-flex u-flex--column" :style="pageThemeStyle">
    <TheHeader />
    <main>
      <NuxtPage/>
    </main>
    <TheFooter />
    <TheFloatingPromo />
  </div>
</template>

<script setup lang="ts">
// Applied here (not inside PagesDefault.vue) so the CSS variables reach
// TheFooter too — it's a sibling of <main>, not a descendant of the page
// content, so it needs a shared ancestor to inherit from. See
// usePageTheme.ts for where the per-page overrides are declared and
// [...slug].vue for where this state gets updated on navigation.
const pageTheme = usePageTheme()
const pageThemeStyle = computed(() => {
  const theme = pageTheme.value
  if (!theme) return undefined
  const style: Record<string, string> = { '--color-page-accent': theme.accent }
  if (theme.onAccent) style['--color-page-on-accent'] = theme.onAccent
  if (theme.onAccentRgb) style['--color-page-on-accent-rgb'] = theme.onAccentRgb
  return style
})
</script>

<style lang="scss">
.v-app {
  min-height: 100vh;

  main {
    flex: 1;
  }
}
</style>
