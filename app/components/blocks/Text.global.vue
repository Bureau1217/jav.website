<template>
  <div class="v-block-text-wrap u-flex u-flex--column u-gap-xl">
    <UiSectionHeader v-if="block.content.title" :title="titleHtml" />
    <div class="v-block-text" v-html="block.content.text" />
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// The "title" field is inline (see text.yml), so newly-saved content is
// never wrapped in <p> — but content saved before it became inline still
// is, and UiSectionHeader renders it inside an <h1>, where a nested <p>
// isn't valid HTML. Strip one if present — same fix as Citation.global.vue.
const titleHtml = computed(() => {
  const raw = props.block.content.title ?? ''
  const match = raw.trim().match(/^<p>([\s\S]*)<\/p>$/i)
  return match ? match[1] : raw
})
</script>

<style lang="scss" scoped>
.v-block-text-wrap {
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);
  color: var(--color-page-accent);
  max-width: 1100px;
}

.v-block-text {
  @include type-body-large;

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;
  }

  :deep(strong) {
    font-weight: 800;
  }

  :deep(em) {
    font-style: italic;
  }

  // Global reset (typo.scss) strips every list's own marker/indent — restore
  // both here so the writer field's bullet/numbered lists (and their nested,
  // Tab-indented sub-lists) actually render as such instead of as plain
  // unmarked paragraphs.
  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-m);
    padding-left: var(--spacing-xl);
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);

    ul,
    ol {
      margin-top: var(--spacing-xs);
      margin-bottom: 0;
    }
  }

  :deep(li:last-child) {
    margin-bottom: 0;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }
}
</style>
