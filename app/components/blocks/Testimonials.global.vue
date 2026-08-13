<template>
  <div class="v-block-testimonials">
    <UiSectionHeader title="Témoignages" class="v-block-testimonials__header" />

    <div v-if="testimonials?.length" class="v-block-testimonials__grid">
      <article
        v-for="(item, index) in testimonials"
        :key="index"
        class="v-block-testimonials__card"
        :style="{ '--card-color': cardColor(index) }"
      >
        <UiDivider :color="cardColor(index)" />
        <div class="v-block-testimonials__card-background">
          <img v-if="item.photo" :src="item.photo.url" :alt="item.photo.alt ?? ''">
        </div>
        <UiDivider :color="cardColor(index)" />
        <div class="v-block-testimonials__card-content">
          <p v-if="item.role?.length" class="v-block-testimonials__card-name">{{ item.role.join(' · ') }}</p>
          <div class="v-block-testimonials__card-quote" v-html="item.text" />
        </div>
      </article>
    </div>
    <p v-else class="v-block-testimonials__empty">Pas encore de témoignage publié.</p>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlTestimonial } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "testimonials" Kirby block has no editable fields — it's an anchor.
// Real quotes live in the "testimony_items" structure on pages using the
// "testimonials" template, fetched from /api/testimonials (see
// server/api/testimonials.get.ts).
const { data: testimonials } = await useFetch<KqlTestimonial[]>('/api/testimonials')

const palette = ['var(--color-brand-01)', 'var(--color-brand-03)', 'var(--color-brand-05)', 'var(--color-brand-07)']
function cardColor(index: number) {
  return palette[index % palette.length]
}
</script>

<style lang="scss" scoped>
.v-block-testimonials {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4xl);
  padding: var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-testimonials__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.v-block-testimonials__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.v-block-testimonials__card-background {
  height: 357px;
  background: var(--card-color);
  opacity: 0.35;
  border-radius: var(--radius-s);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
  }
}

.v-block-testimonials__card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-s);
}

.v-block-testimonials__card-name {
  @include text-label;
}

.v-block-testimonials__card-quote {
  @include text-body-large;

  :deep(p) {
    margin: 0;
  }
}

.v-block-testimonials__empty {
  @include empty-state;
}
</style>
