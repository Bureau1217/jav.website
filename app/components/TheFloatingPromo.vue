<template>
  <UiCard
    v-if="isVisible && nextEvent"
    background="var(--color-brand-01)"
    color="var(--color-brand-04)"
    class="v-floating-promo"
  >
    <div class="v-floating-promo__header">
      <p class="v-floating-promo__tag">Bientôt</p>
      <button type="button" class="v-floating-promo__close" aria-label="Fermer" @click="isVisible = false">
        ✕
      </button>
    </div>
    <p class="v-floating-promo__title">{{ nextEvent.title }}</p>
    <UiButton :to="nextEvent.ticketLink || `/agenda/${nextEvent.id}`" class="v-floating-promo__cta">
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-2xl);
  padding: var(--spacing-xl);

  @media (max-width: 900px) {
    right: var(--spacing-m);
    top: auto;
    bottom: var(--spacing-m);
    width: calc(100% - var(--spacing-m) * 2);
  }
}

.v-floating-promo__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.v-floating-promo__tag {
  @include tag-date;
}

.v-floating-promo__close {
  background: transparent;
  border: none;
  color: var(--color-brand-04);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: var(--spacing-xs);
}

.v-floating-promo__title {
  @include heading-3;
  font-size: var(--spacing-2xl);
  width: 100%;
  white-space: pre-line;
}

.v-floating-promo__cta {
  --button-color: var(--color-brand-04);
  --button-text: var(--color-brand-01);
}
</style>
