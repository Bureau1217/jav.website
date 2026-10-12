<template>
  <div class="v-block-testimonials u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader :title="block.content.title || 'Témoignages'" class="v-block-testimonials__header" />

    <div v-if="items.length" class="v-block-testimonials__cards">
      <article
        v-for="(item, index) in items"
        :key="index"
        class="v-block-testimonials__card u-flex u-flex--column"
      >
        <UiDivider />
        <div class="v-block-testimonials__card-media">
          <img
            v-if="item.photo"
            v-bind="imageAttrs(item.photo, '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw')"
            :alt="item.photo.alt ?? ''"
            :style="{ objectPosition: objectPosition(item.photo) }"
          >
          <!-- "Étudiant" / "Alumni" (the Panel's "statut" tags field), top-left
               of the photo — outline only, no background fill. -->
          <UiTag v-if="item.role.length" class="v-block-testimonials__card-tag">
            {{ item.role.join(' · ') }}
          </UiTag>
        </div>
        <UiDivider />
        <div class="v-block-testimonials__card-content u-flex u-flex--column u-gap-xs">
          <span v-if="item.name" class="v-block-testimonials__card-name">{{ item.name }}</span>
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
// Real quotes live in the "testimony_items" structure on the "Témoignages"
// page (intendedTemplate "testimonials"), fetched from /api/testimonials
// (see server/api/testimonials.get.ts).
const { data: testimonials } = await useFetch<KqlTestimonial[]>('/api/testimonials')

const items = computed(() => testimonials.value ?? [])
</script>

<style lang="scss" scoped>
// Follows the page's own theme (see usePageTheme.ts), same as most other
// blocks — mint-on-green by default, e.g. white-on-maroon on Formation Pro.
.v-block-testimonials {
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
}

// All testimonials in one 3-column grid (2 on tablet, 1 on mobile) — every
// one is the same photo-on-top, quote-below card.
.v-block-testimonials__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-testimonials__card-media {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: var(--color-brand-00);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-testimonials__card-tag {
  position: absolute;
  top: var(--spacing-m);
  left: var(--spacing-m);
  // UiTag reads this for both its text and its border.
  --ui-tag-color: var(--color-page-on-accent);
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
  // Smaller than the mixin's own 24px — three cards side by side.
  font-size: 18px;

  // Full-width single column on mobile (see .cards above) — stays 18px
  // (same as desktop, no further reduction needed here).
  @media (max-width: $breakpoint-mobile) {
    font-size: 16px;
  }

  // The writer field's HTML (<p>, <br>, <em>, <strong>...) is rendered as
  // authored: the global reset (typo.scss) zeroes every <p>'s margin and
  // every list's marker/indent, and gives <p> its own 24px size — so
  // paragraph spacing, list markers and the inline styles are restored here,
  // and <p> inherits this card's smaller size instead. <br> line breaks
  // already render natively.
  :deep(p) {
    margin: 0 0 var(--spacing-s);
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;
  }

  :deep(strong),
  :deep(b) {
    font-weight: 800;
  }

  :deep(em),
  :deep(i) {
    font-style: italic;
  }

  :deep(u) {
    text-decoration: underline;
  }

  :deep(s),
  :deep(del) {
    text-decoration: line-through;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-s);
    padding-left: var(--spacing-xl);
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xxs);
  }
}

// Real <p> — font comes from typo.scss's bare tag rule (Inter body-large).
.v-block-testimonials__empty {
  opacity: 0.7;
}
</style>
