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
          <h3 class="v-block-toggle__title">{{ item.titre }}</h3>
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
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);
  color: var(--color-page-accent);
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

// Real <h3>, but overridden locally to Inter instead of the canonical h3
// (GT Maru, type-heading-3) — FAQ item titles use their own
// type-text-heading-3 (Inter 700/40px) instead.
.v-block-toggle__title {
  @include type-text-heading-3;
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
    background: var(--color-page-accent);
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
  @include type-body-large;
  padding-top: var(--spacing-s);
}
</style>
