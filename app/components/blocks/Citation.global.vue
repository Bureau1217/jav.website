<template>
  <div class="v-block-citation-wrap u-flex u-flex--column u-gap-m">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <blockquote class="v-block-citation u-flex u-flex--column u-gap-m">
      <div class="v-block-citation__content" v-html="block.content.contenu" />
      <cite v-if="block.content.signature">{{ block.content.signature }}</cite>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-citation-wrap {
  margin: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-citation {
  padding: var(--spacing-xl);
  border-left: 6px solid var(--color-brand-04);
  color: var(--color-brand-04);
}

.v-block-citation__content {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1;

  :deep(p) {
    margin: 0;
  }
}

cite {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
  font-style: normal;
}
</style>
