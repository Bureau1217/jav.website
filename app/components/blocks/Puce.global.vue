<template>
  <div class="v-block-puce u-flex u-gap-m u-gutter-x">
    <span class="v-block-puce__dot" aria-hidden="true" />
    <div class="v-block-puce__body u-flex u-flex--column u-gap-xs">
      <div v-if="tagList.length" class="v-block-puce__tags u-flex u-gap-xs u-flex--wrap">
        <UiTag v-for="tag in tagList" :key="tag">{{ tag }}</UiTag>
      </div>
      <div v-if="block.content.title" class="v-block-puce__title" v-html="block.content.title" />
      <div v-if="block.content.text" class="v-block-puce__text" v-html="block.content.text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// Kirby's "tags" field stores its raw value as a single comma-separated
// string (not an array) — split it into pills, same as Section/Cartels.
const tagList = computed(() => {
  const raw = props.block.content.tags
  if (!raw) return []
  return String(raw).split(',').map((tag: string) => tag.trim()).filter(Boolean)
})
</script>

<style lang="scss" scoped>
.v-block-puce {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
  max-width: 1100px;
}

// A fixed dot, not a real <li> marker — this block is a single standalone
// bullet point (title + text), not part of a list of sibling Puce blocks,
// so there's no <ul> to let the browser render the marker itself.
.v-block-puce__dot {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  margin-top: 12px; // roughly centers on the title's first line of text
  border-radius: 50%;
  background: currentColor;
}

// Fully rounded pill (not UiTag's own default squared-off radius-s) — this
// block's own look, per the reference mockup.
.v-block-puce__tags {
  :deep(.ui-tag) {
    border-radius: var(--radius-pill);
  }
}

.v-block-puce__title {
  @include type-body-large-bold;

  :deep(p) {
    margin: 0;
  }

  :deep(strong) {
    font-weight: 800;
  }

  :deep(em) {
    font-style: italic;
  }
}

.v-block-puce__text {
  @include type-body-large;

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
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
  // both here, same treatment as Text.global.vue/Cartels.global.vue.
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
}
</style>
