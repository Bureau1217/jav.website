<template>
  <div class="v-block-teachers-wrap u-flex u-flex--column u-gap-xl u-gutter">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-teachers">
      <UiCard
        v-for="teacher in block.teacherPages"
        :key="teacher.id"
        :to="`/${teacher.id}`"
        background="var(--color-brand-05)"
        color="var(--color-brand-04)"
        class="v-block-teachers__item u-flex u-flex--align-center u-gap-xl"
      >
        <img v-if="teacher.photo" :src="teacher.photo.url" :alt="teacher.photo.alt ?? teacher.title">
        <div class="v-block-teachers__text u-flex u-flex--column u-gap-xs">
          <h3 class="v-block-teachers__name">{{ teacher.title }}</h3>
          <span v-if="teacher.fonction" class="v-block-teachers__fonction">{{ teacher.fonction }}</span>
        </div>
      </UiCard>
    </div>
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

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-teachers__item {
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

// Was a <span> styled to look exactly like the global h3 — now a real
// <h3> (no local override needed, typo.scss covers it entirely). The
// wrapper above became a <div>, since a <span> can't validly contain a
// heading.
.v-block-teachers__fonction {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;
  display: block;
}
</style>
