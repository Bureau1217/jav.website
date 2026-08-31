<template>
  <div class="ui-section-header u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
    <h2 v-if="title" v-html="title" />
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
</style>
