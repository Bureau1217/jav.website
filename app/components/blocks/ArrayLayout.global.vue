<template>
  <div class="v-block-array-layout">
    <h3 v-if="block.content.title">{{ block.content.title }}</h3>
    <div class="v-block-array-layout__columns">
      <div
        v-for="(column, index) in block.content.columns"
        :key="index"
        class="v-block-array-layout__column"
      >
        <div v-if="column.columns_title" v-html="column.columns_title" />
        <Blocks :blocks="parseKqlBlocks(column.columns_content)" :images="images" :files="files" />
      </div>
    </div>
  </div>
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
.v-block-array-layout {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }

  h3 {
    @include heading-3;
  }
}

.v-block-array-layout__columns {
  display: flex;
  gap: var(--spacing-2xl);

  @media (max-width: 900px) {
    flex-direction: column;
  }
}

.v-block-array-layout__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);

  > div:first-child {
    @include text-label;
    text-transform: none;
  }
}
</style>
