<template>
  <div class="v-block-concerts-event u-flex u-flex--column u-gap-4xl u-gutter">
    <UiSectionHeader
      :title="block.content.title || 'Concerts &amp; Évènements'"
      link-to="/agenda"
      link-text="Voir tout l'agenda"
      class="v-block-concerts-event__header"
    />

    <div v-if="events?.length" class="v-block-concerts-event__grid">
      <UiCard
        v-for="event in events"
        :key="event.id"
        background="var(--color-brand-05)"
        class="v-block-concerts-event__card u-flex"
      >
        <div class="v-block-concerts-event__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
          <div class="v-block-concerts-event__card-header u-flex u-flex--column u-gap-s">
            <p class="v-block-concerts-event__card-date">{{ formatEventDate(event.date) }}</p>
            <h3 class="v-block-concerts-event__card-title">{{ event.title }}</h3>
          </div>
          <div class="v-block-concerts-event__card-footer u-flex u-flex--column u-gap-s">
            <UiDivider color="var(--color-brand-02)" />
            <div class="v-block-concerts-event__card-description" v-html="event.description" />
            <UiDivider color="var(--color-brand-02)" />
          </div>
        </div>
        <div class="v-block-concerts-event__card-media u-flex u-flex--column u-flex--align-end u-flex--justify-between">
          <img v-if="event.cover" :src="event.cover.url" :alt="event.cover.alt ?? ''">
          <UiTag v-if="event.type" color="var(--color-brand-05)" class="v-block-concerts-event__card-filter">
            {{ eventTypeLabel(event.type) }}
          </UiTag>
          <UiButton :to="event.ticketLink || `/agenda/${event.id}`" class="v-block-concerts-event__card-cta">
            En savoir plus
          </UiButton>
        </div>
      </UiCard>
    </div>
    <p v-else class="v-block-concerts-event__empty">Aucun évènement à venir pour le moment.</p>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlEvent } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "concerts-event" Kirby block has no editable fields — it's an anchor.
// Real events live in the site-wide "évènements" collection and are fetched
// from /api/events (see server/api/events.get.ts).
const { data: events } = await useFetch<KqlEvent[]>('/api/events')

const TYPE_LABELS: Record<string, string> = {
  concert: 'Concert',
  'table-ronde': 'Table ronde'
}

function eventTypeLabel(type: string) {
  return TYPE_LABELS[type] ?? type
}

function formatEventDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style lang="scss" scoped>
.v-block-concerts-event {
  color: var(--color-brand-04);
}

.v-block-concerts-event__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  .v-block-concerts-event__card:first-child {
    grid-column: span 2;

    @media (max-width: 700px) {
      grid-column: span 1;
    }
  }
}

.v-block-concerts-event__card {
  min-height: 505px;

  @media (max-width: 700px) {
    flex-direction: column;
    min-height: 0;
  }
}

.v-block-concerts-event__card-content {
  flex: 1;
  padding: var(--spacing-xl);
}

.v-block-concerts-event__card-date {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
  text-transform: uppercase;
  color: var(--color-brand-02);
}

// Was a <p> styled to look exactly like the global h3 — now a real <h3>
// (section title above is an h2, via UiSectionHeader), so it inherits
// family/weight/size/line-height straight from typo.scss. Only the color
// is card-specific.
.v-block-concerts-event__card-title {
  color: var(--color-brand-02);
}

.v-block-concerts-event__card-description {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--color-brand-02);

  :deep(p) {
    margin: 0;
  }
}

.v-block-concerts-event__card-media {
  position: relative;
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-xl);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-concerts-event__card-filter {
  position: relative;
}

.v-block-concerts-event__card-cta {
  position: relative;
  --button-color: var(--color-brand-05);
  --button-text: var(--color-brand-02);
}

.v-block-concerts-event__empty {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;
  opacity: 0.7;
}
</style>
