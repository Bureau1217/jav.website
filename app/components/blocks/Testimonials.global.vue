<template>
  <div class="v-block-testimonials u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader :title="block.content.title || 'Témoignages'" class="v-block-testimonials__header" />

    <div v-if="featured" class="v-block-testimonials__layout">
      <!-- The first testimonial is always the big, highlighted card — every
           other one shows as a plain photo card alongside it (see the
           clarifying question this was built from: a fixed featured slot,
           not a carousel). -->
      <UiCard
        background="var(--color-page-accent)"
        color="var(--color-page-on-accent)"
        class="v-block-testimonials__featured u-flex u-flex--column u-flex--justify-between u-gap-2xl"
      >
        <div class="v-block-testimonials__featured-row u-flex u-flex--align-start u-flex--justify-between u-gap-m">
          <span class="v-block-testimonials__featured-label">Témoignage</span>
          <UiTag v-if="featured.role.length">{{ featured.role.join(' · ') }}</UiTag>
        </div>
        <div class="v-block-testimonials__featured-quote" v-html="featured.text" />
      </UiCard>

      <div v-if="otherItems.length" class="v-block-testimonials__cards">
        <article
          v-for="(item, index) in otherItems"
          :key="index"
          class="v-block-testimonials__card u-flex u-flex--column"
        >
          <UiDivider />
          <div class="v-block-testimonials__card-media">
            <img
              v-if="item.photo"
              :src="item.photo.url"
              :alt="item.photo.alt ?? ''"
              :style="{ objectPosition: objectPosition(item.photo) }"
            >
          </div>
          <UiDivider />
          <div class="v-block-testimonials__card-content u-flex u-flex--column u-gap-xs">
            <span v-if="item.name" class="v-block-testimonials__card-name">{{ item.name }}</span>
            <div class="v-block-testimonials__card-quote" v-html="item.text" />
          </div>
        </article>
      </div>
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
// Real quotes live in the "testimony_items" structure on the "Témoignages"
// page (intendedTemplate "testimonials"), fetched from /api/testimonials
// (see server/api/testimonials.get.ts).
const { data: testimonials } = await useFetch<KqlTestimonial[]>('/api/testimonials')

const featured = computed(() => testimonials.value?.[0] ?? null)
const otherItems = computed(() => testimonials.value?.slice(1) ?? [])
</script>

<style lang="scss" scoped>
// Follows the page's own theme (see usePageTheme.ts), same as most other
// blocks — mint-on-green by default, e.g. white-on-maroon on Formation Pro.
.v-block-testimonials {
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
}

// Plain cards on the left, the single featured card on the right — named
// areas (not source order) place them, so the featured card can come first
// in markup (it's the one that should lead on a stacked mobile layout)
// while still rendering on the right on desktop.
.v-block-testimonials__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "cards featured";
  align-items: stretch;
  gap: var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    grid-template-areas: "featured" "cards";
  }
}

.v-block-testimonials__cards {
  grid-area: cards;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-testimonials__card-media {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: var(--color-brand-00);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-testimonials__card-content {
  padding-top: var(--spacing-s);
}

// A <span>, not a <p> — this uses type-label (uppercase), unlike a <p>'s
// canonical style.
.v-block-testimonials__card-name {
  @include type-label;
}

// No decorative quote marks here — the existing témoignage text is already
// authored with its own literal quotes (and often a trailing attribution
// line), so adding generated ones on top would double them up.
.v-block-testimonials__card-quote {
  @include type-body-large;
  // Smaller than the mixin's own 24px even on desktop — these are plain
  // secondary cards next to the much bigger featured quote, not meant to
  // read as prominently.
  font-size: 18px;

  // Full-width single column on mobile (see .cards above) — stays 18px
  // (same as desktop, no further reduction needed here).
  @media (max-width: $breakpoint-mobile) {
    font-size: 16px;
  }

  :deep(p) {
    margin: 0;
  }
}

.v-block-testimonials__featured {
  grid-area: featured;
  padding: var(--spacing-2xl);
}

.v-block-testimonials__featured-label {
  @include type-label;
}

.v-block-testimonials__featured-quote {
  @include type-emphasis;

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }

  :deep(p) {
    margin: 0;
  }
}

// Real <p> — font comes from typo.scss's bare tag rule (Inter body-large).
.v-block-testimonials__empty {
  opacity: 0.7;
}
</style>
