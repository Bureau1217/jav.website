<template>
  <div class="ui-section-header u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
    <h1 v-if="title" class="ui-section-header__title" v-html="title" />
    <UiButton
      v-if="linkTo"
      variant="secondary"
      :to="linkTo"
      class="ui-section-header__link"
    >
      {{ linkText }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
/**
 * The "title + optional secondary link" row used at the top of several
 * blocks (concerts/events, testimonials, gallery...). Kept intentionally
 * minimal — just the title and an optional link — since blocks that need
 * a richer intro (tags, rich text) build their own header, e.g. Section.vue.
 */
withDefaults(defineProps<{
  title?: string
  linkTo?: string
  linkText?: string
}>(), {
  title: undefined,
  linkTo: undefined,
  linkText: undefined
})
</script>

<style lang="scss" scoped>
.ui-section-header {
  width: 100%;
}

// Only the title is capped — not the whole row — so the optional link
// button (e.g. "Voir tout l'agenda") stays pinned to the right via the
// row's own justify-between, instead of being dragged in alongside it.
.ui-section-header__title {
  max-width: 400px; // same cap as Citation/Text blocks, keeps the title from stretching edge-to-edge
}
</style>
