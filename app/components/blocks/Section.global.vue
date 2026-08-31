<template>
  <section class="v-block-section u-flex u-flex--column">
    <header v-if="block.content.title || block.content.text" class="v-block-section__header u-flex u-flex--column u-gap-m">
      <h2 v-if="block.content.title" v-html="block.content.title" />
      <p v-if="block.content.tags">{{ block.content.tags }}</p>
      <div v-if="block.content.text" v-html="block.content.text" />
      <UiButton
        v-if="block.content.link?.link_url"
        variant="secondary"
        :to="block.content.link.link_url"
        class="v-block-section__link"
      >
        {{ block.content.link.link_text }}
      </UiButton>
    </header>

    <Blocks :blocks="parseKqlBlocks(block.content.content)" :images="images" :files="files" />
  </section>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
}>()
</script>

<style lang="scss" scoped>
.v-block-section {
  color: var(--color-brand-04);
}

.v-block-section__header {
  padding: var(--gutter) var(--gutter) 0;

  p:first-of-type {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: var(--spacing-m); // 16px
    line-height: 1;
    text-transform: uppercase;
  }
}

.v-block-section__link {
  align-self: flex-start;
}
</style>
