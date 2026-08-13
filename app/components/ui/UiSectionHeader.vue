<template>
  <div class="ui-section-header">
    <h2 v-if="title">{{ title }}</h2>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  width: 100%;

  h2 {
    @include heading-1;
  }
}
</style>
