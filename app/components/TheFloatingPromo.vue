<template>
  <UiCard
    v-if="isVisible && nextEvent"
    background="var(--color-page-accent)"
    color="var(--color-page-on-accent)"
    class="v-floating-promo u-flex u-flex--column u-flex--align-end u-gap-2xl"
  >
    <div class="v-floating-promo__header u-flex u-flex--align-center u-flex--justify-between">
      <span class="v-floating-promo__tag">Bientôt</span>
      <button type="button" class="v-floating-promo__close" aria-label="Fermer" @click="isVisible = false">
        ✕
      </button>
    </div>
    <div class="v-floating-promo__title">{{ nextEvent.title }}</div>
    <UiButton :to="nextEvent.ticketLink || `/${nextEvent.id}`" class="v-floating-promo__cta">
      En savoir plus
    </UiButton>
  </UiCard>
</template>

<script setup lang="ts">
import type { KqlEvent } from '~~/shared/types/kql'

// Shows the soonest upcoming event from the site-wide "évènements"
// collection (server/api/events.get.ts already sorts by date ascending).
const { data: events } = await useFetch<KqlEvent[]>('/api/events')
const nextEvent = computed(() => events.value?.[0] ?? null)

const isVisible = ref(true)
</script>

<style lang="scss" scoped>
.v-floating-promo {
  position: fixed;
  top: 125px;
  right: var(--spacing-6xl);
  z-index: 90;
  width: 267px;
  padding: var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    right: var(--spacing-m);
    top: auto;
    bottom: var(--spacing-m);
    width: calc(100% - var(--spacing-m) * 2);
  }
}

.v-floating-promo__header {
  width: 100%;
}

.v-floating-promo__tag {
  @include type-tag-date;
}

.v-floating-promo__close {
  background: transparent;
  border: none;
  color: var(--color-page-on-accent);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: var(--spacing-xs);
}

// A <div>, not a <h3> — kept at a smaller custom size than h3's canonical
// heading-3 (40px) so it fits the floating card.
.v-floating-promo__title {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 32px;
  line-height: 1;
  width: 100%;
  white-space: pre-line;
}

.v-floating-promo__cta {
  --button-color: var(--color-page-on-accent);
  --button-text: var(--color-page-accent);
}
</style>
