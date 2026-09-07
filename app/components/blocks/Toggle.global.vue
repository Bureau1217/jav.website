<template>
  <div class="v-block-toggle u-flex u-flex--column">
    <UiSectionHeader
      v-if="block.content.title"
      :title="block.content.title"
      :link-to="block.content.link?.link_url"
      :link-text="block.content.link?.link_text"
    />
    <template v-for="(item, index) in block.content.items" :key="index">
      <UiDivider v-if="index > 0" variant="thin" />
      <details class="v-block-toggle__item">
        <summary class="u-flex u-flex--align-center u-flex--justify-between u-gap-5xl">
          <span class="v-block-toggle__title">{{ item.titre }}</span>
          <span class="v-block-toggle__icon" aria-hidden="true" />
        </summary>
        <div class="v-block-toggle__content" v-html="item.contenu" />
      </details>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-toggle {
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
  gap: var(--spacing-xl);
}

.v-block-toggle__item {
  &[open] .v-block-toggle__icon {
    transform: rotate(45deg);
  }
}

.v-block-toggle__item summary {
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.v-block-toggle__title {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1;
  flex: 1;
}

.v-block-toggle__icon {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--color-brand-04);
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 100%;
    height: 3px;
  }

  &::after {
    width: 3px;
    height: 100%;
  }
}

.v-block-toggle__content {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;
  padding-top: var(--spacing-s);
}
</style>
