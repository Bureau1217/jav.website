<template>
  <div class="v-block-toggle">
    <details
      v-for="(item, index) in block.content.items"
      :key="index"
      class="v-block-toggle__item"
    >
      <summary>
        <span class="v-block-toggle__title">{{ item.titre }}</span>
        <span class="v-block-toggle__icon" aria-hidden="true" />
      </summary>
      <div class="v-block-toggle__content" v-html="item.contenu" />
    </details>
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
  display: flex;
  flex-direction: column;
  color: var(--color-brand-04);
}

.v-block-toggle__item {
  padding-top: var(--spacing-xl);
  border-top: 2px solid var(--color-brand-04);

  &:first-child {
    border-top: none;
  }

  & + & {
    margin-top: var(--spacing-xl);
  }

  &[open] .v-block-toggle__icon {
    transform: rotate(45deg);
  }
}

.v-block-toggle__item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-5xl);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.v-block-toggle__title {
  @include text-heading-2;
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
  @include text-body-large;
  padding-top: var(--spacing-s);
}
</style>
