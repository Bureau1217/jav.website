<template>
  <section class="v-block-section">
    <header v-if="block.content.title || block.content.text" class="v-block-section__header">
      <h2 v-if="block.content.title">{{ block.content.title }}</h2>
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
  display: flex;
  flex-direction: column;
  color: var(--color-brand-04);
}

.v-block-section__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
  padding: var(--spacing-6xl) var(--spacing-6xl) 0;

  @media (max-width: 900px) {
    padding: var(--spacing-xl) var(--spacing-xl) 0;
  }

  h2 {
    @include heading-1;
  }

  p:first-of-type {
    @include text-label;
  }
}

.v-block-section__link {
  align-self: flex-start;
}
</style>
