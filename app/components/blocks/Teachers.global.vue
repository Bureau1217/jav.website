<template>
  <div class="v-block-teachers">
    <UiCard
      v-for="teacher in block.teacherPages"
      :key="teacher.id"
      :to="`/${teacher.id}`"
      background="var(--color-brand-05)"
      color="var(--color-brand-04)"
      class="v-block-teachers__item"
    >
      <img v-if="teacher.photo" :src="teacher.photo.url" :alt="teacher.photo.alt ?? teacher.title">
      <span class="v-block-teachers__text">
        <span class="v-block-teachers__name">{{ teacher.title }}</span>
        <span v-if="teacher.fonction" class="v-block-teachers__fonction">{{ teacher.fonction }}</span>
      </span>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-teachers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
  padding: var(--spacing-6xl);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: var(--spacing-xl);
  }
}

.v-block-teachers__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  text-decoration: none;
  min-height: 297px;

  img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
}

.v-block-teachers__text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.v-block-teachers__name {
  @include heading-3;
  display: block;
}

.v-block-teachers__fonction {
  @include text-body-large;
  display: block;
}
</style>
