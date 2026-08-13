<template>
  <div class="v-block-concerts-event">
    <UiSectionHeader
      title="Concerts & Évènements"
      link-to="/agenda"
      link-text="Voir tout l'agenda"
      class="v-block-concerts-event__header"
    />

    <div v-if="events?.length" class="v-block-concerts-event__grid">
      <UiCard
        v-for="event in events"
        :key="event.id"
        background="var(--color-brand-05)"
        class="v-block-concerts-event__card"
      >
        <div class="v-block-concerts-event__card-content">
          <div class="v-block-concerts-event__card-header">
            <p class="v-block-concerts-event__card-date">{{ formatEventDate(event.date) }}</p>
            <p class="v-block-concerts-event__card-title">{{ event.title }}</p>
          </div>
          <div class="v-block-concerts-event__card-footer">
            <UiDivider color="var(--color-brand-02)" />
            <div class="v-block-concerts-event__card-description" v-html="event.description" />
            <UiDivider color="var(--color-brand-02)" />
          </div>
        </div>
        <div class="v-block-concerts-event__card-media">
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4xl);
  padding: var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
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
  display: flex;
  min-height: 505px;

  @media (max-width: 700px) {
    flex-direction: column;
    min-height: 0;
  }
}

.v-block-concerts-event__card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-xl);
  gap: var(--spacing-xl);
}

.v-block-concerts-event__card-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
}

.v-block-concerts-event__card-date {
  @include tag-date;
  color: var(--color-brand-02);
}

.v-block-concerts-event__card-title {
  @include heading-3;
  color: var(--color-brand-02);
}

.v-block-concerts-event__card-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
}


.v-block-concerts-event__card-description {
  @include text-body-large-bold;
  color: var(--color-brand-02);

  :deep(p) {
    margin: 0;
  }
}

.v-block-concerts-event__card-media {
  position: relative;
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
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
  @include empty-state;
}
</style>
