<template>
  <div class="v-block-concerts-event u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader
      :title="block.content.title || 'Concerts &amp; Évènements'"
      :link-to="isAgenda ? undefined : '/agenda'"
      :link-text="isAgenda ? undefined : 'Voir tous les évènements'"
      class="v-block-concerts-event__header"
    />

    <!-- Type filter — /agenda only (the homepage teaser is a fixed, capped
         preview, not a browsable list). Filters the featured event and the
         grid below together, since both come from the same filtered list —
         see filteredUpcomingEvents. -->
    <div v-if="isAgenda" class="v-block-concerts-event__filters u-flex u-gap-s u-flex--wrap">
      <button
        v-for="filter in TYPE_FILTERS"
        :key="filter.value"
        type="button"
        class="v-block-concerts-event__filter"
        :class="{ 'is-active': selectedType === filter.value }"
        @click="selectedType = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <template v-if="displayedEvents.length">
      <!-- Agenda (and anywhere else this block might sit besides the home
           teaser): the "à la une" event stands on its own full-width row,
           2-column split — text pane left, photo pane right — separate
           from the grid of other cards below. On the HOME teaser instead,
           it's simply the first item OF that grid, spanning its first 2
           columns (see gridEvents/.grid--with-featured below) — the
           homepage keeps a single unified block instead of two stacked
           sections. -->
      <UiCard
        v-if="!isHome && featuredEvent"
        :background="palette(featuredEvent.index).bg"
        :color="palette(featuredEvent.index).accent"
        class="v-block-concerts-event__card v-block-concerts-event__card--featured u-flex"
      >
        <div class="v-block-concerts-event__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
          <div class="v-block-concerts-event__card-header u-flex u-flex--column u-gap-s">
            <span class="v-block-concerts-event__card-date">{{ formatEventDate(featuredEvent.event.date) }}</span>
            <h3 class="v-block-concerts-event__card-title">{{ featuredEvent.event.title }}</h3>
          </div>
          <div class="v-block-concerts-event__card-footer u-flex u-flex--column u-gap-s">
            <UiDivider />
            <div class="v-block-concerts-event__card-description">{{ truncateText(featuredEvent.event.description) }}</div>
            <UiDivider />
          </div>
        </div>
        <div class="v-block-concerts-event__card-media u-flex u-flex--column u-flex--align-end u-flex--justify-between">
          <img v-if="featuredEvent.event.cover" :src="featuredEvent.event.cover.url" :alt="featuredEvent.event.cover.alt ?? ''" :style="{ objectPosition: objectPosition(featuredEvent.event.cover) }">
          <div v-if="featuredEvent.event.cover" class="v-block-concerts-event__card-gradient" :style="{ background: photoGradient(featuredEvent.index) }" />
          <UiTag v-if="featuredEvent.event.type" :color="palette(featuredEvent.index).bg" class="v-block-concerts-event__card-filter">
            {{ eventTypeLabel(featuredEvent.event.type) }}
          </UiTag>
          <UiButton
            :to="`/${featuredEvent.event.id}`"
            class="v-block-concerts-event__card-cta"
            :style="{ '--button-color': palette(featuredEvent.index).bg, '--button-text': palette(featuredEvent.index).accent }"
          >
            En savoir plus
          </UiButton>
        </div>
      </UiCard>

      <div
        v-if="gridEvents.length"
        class="v-block-concerts-event__grid"
        :class="{ 'v-block-concerts-event__grid--with-featured': isHome }"
      >
        <UiCard
          v-for="({ event, index }, position) in gridEvents"
          :key="event.id"
          :background="palette(index).bg"
          :color="palette(index).accent"
          class="v-block-concerts-event__card u-flex"
          :class="[
            isHome && position === 0 ? 'v-block-concerts-event__card--featured' : 'u-flex--column',
            !isHome && event.cover ? 'v-block-concerts-event__card--photo' : ''
          ]"
        >
          <!-- HOME's own featured slot (first card of the grid) — same
               2-column split as the standalone agenda version above. -->
          <template v-if="isHome && position === 0">
            <div class="v-block-concerts-event__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
              <div class="v-block-concerts-event__card-header u-flex u-flex--column u-gap-s">
                <span class="v-block-concerts-event__card-date">{{ formatEventDate(event.date) }}</span>
                <h3 class="v-block-concerts-event__card-title">{{ event.title }}</h3>
              </div>
              <div class="v-block-concerts-event__card-footer u-flex u-flex--column u-gap-s">
                <UiDivider />
                <div class="v-block-concerts-event__card-description">{{ truncateText(event.description) }}</div>
                <UiDivider />
              </div>
            </div>
            <div class="v-block-concerts-event__card-media u-flex u-flex--column u-flex--align-end u-flex--justify-between">
              <img v-if="event.cover" :src="event.cover.url" :alt="event.cover.alt ?? ''" :style="{ objectPosition: objectPosition(event.cover) }">
              <div v-if="event.cover" class="v-block-concerts-event__card-gradient" :style="{ background: photoGradient(index) }" />
              <UiTag v-if="event.type" :color="palette(index).bg" class="v-block-concerts-event__card-filter">
                {{ eventTypeLabel(event.type) }}
              </UiTag>
              <UiButton
                :to="`/${event.id}`"
                class="v-block-concerts-event__card-cta"
                :style="{ '--button-color': palette(index).bg, '--button-text': palette(index).accent }"
              >
                En savoir plus
              </UiButton>
            </div>
          </template>

          <!-- Agenda only: event with a cover image gets the full-bleed
               photo-on-top treatment (date + tag overlaid on it), colored
               panel below with title/description/CTA. Never shown on the
               home teaser — every non-featured card there is plain text,
               regardless of whether the event has a cover. -->
          <template v-else-if="!isHome && event.cover">
            <div class="v-block-concerts-event__card-photo">
              <img :src="event.cover.url" :alt="event.cover.alt ?? ''" :style="{ objectPosition: objectPosition(event.cover) }">
              <div class="v-block-concerts-event__card-gradient" :style="{ background: photoGradient(index) }" />
              <span class="v-block-concerts-event__card-photo-date">{{ formatEventDate(event.date) }}</span>
              <UiTag v-if="event.type" class="v-block-concerts-event__card-photo-tag">
                {{ eventTypeLabel(event.type) }}
              </UiTag>
            </div>
            <div class="v-block-concerts-event__card-panel u-flex u-flex--column u-flex--justify-between u-gap-s">
              <div class="u-flex u-flex--column u-gap-s">
                <h3 class="v-block-concerts-event__card-title">{{ event.title }}</h3>
                <div class="v-block-concerts-event__card-description">{{ truncateText(event.description) }}</div>
              </div>
              <div class="u-flex u-flex--column u-gap-s">
                <UiDivider />
                <UiButton
                  :to="`/${event.id}`"
                  class="v-block-concerts-event__card-cta"
                  :style="{ '--button-color': palette(index).accent, '--button-text': palette(index).bg }"
                >
                  En savoir plus
                </UiButton>
              </div>
            </div>
          </template>

          <!-- Plain text card — every home card but the featured one, or
               any agenda card without a cover image. -->
          <div v-else class="v-block-concerts-event__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
            <div class="v-block-concerts-event__card-header u-flex u-flex--column u-gap-s">
              <div class="u-flex u-flex--align-start u-flex--justify-between u-gap-s">
                <span class="v-block-concerts-event__card-date">{{ formatEventDate(event.date) }}</span>
                <UiTag v-if="event.type" class="v-block-concerts-event__card-tag">
                  {{ eventTypeLabel(event.type) }}
                </UiTag>
              </div>
              <h3 class="v-block-concerts-event__card-title">{{ event.title }}</h3>
            </div>
            <div class="v-block-concerts-event__card-footer u-flex u-flex--column u-gap-s">
              <UiDivider />
              <div class="v-block-concerts-event__card-description">{{ truncateText(event.description) }}</div>
              <UiDivider />
            </div>
            <UiButton
              :to="`/${event.id}`"
              class="v-block-concerts-event__card-cta"
              :style="{ '--button-color': palette(index).accent, '--button-text': palette(index).bg }"
            >
              En savoir plus
            </UiButton>
          </div>
        </UiCard>
      </div>
    </template>
    <p v-else class="v-block-concerts-event__empty">Aucun évènement à venir pour le moment.</p>

    <!-- Archives — /agenda only, auto-built from past events (no Panel
         content to manage): a year filter followed by a flat dated list.
         See archiveYears/archiveEventsForYear below. -->
    <div v-if="isAgenda && archiveYears.length" class="v-block-concerts-event__archive u-flex u-flex--column u-gap-xl">
      <UiSectionHeader title="Archives" />

      <div class="v-block-concerts-event__archive-years u-flex u-gap-s u-flex--wrap">
        <button
          v-for="year in archiveYears"
          :key="year"
          type="button"
          class="v-block-concerts-event__archive-year"
          :class="{ 'is-active': selectedYear === year }"
          @click="selectedYear = year"
        >
          {{ year }}
        </button>
      </div>

      <UiDivider variant="thin" />

      <template v-for="{ event } in archiveEventsForYear" :key="event.id">
        <NuxtLink :to="`/${event.id}`" class="v-block-concerts-event__archive-row u-flex u-flex--align-center u-flex--justify-between u-gap-xl">
          <span class="v-block-concerts-event__archive-date">{{ formatEventDate(event.date) }}</span>
          <span class="v-block-concerts-event__archive-title">{{ event.title }}</span>
          <UiTag v-if="event.type" class="v-block-concerts-event__archive-tag">{{ eventTypeLabel(event.type) }}</UiTag>
          <span class="v-block-concerts-event__archive-arrow" aria-hidden="true">→</span>
        </NuxtLink>
        <UiDivider variant="thin" />
      </template>
    </div>
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

// This same block renders both on the homepage and on /agenda (it's a
// generic Kirby block, not two separate components) — the homepage teaser
// is capped at 5 events; /agenda shows the full list. Indices are kept
// relative to the FULL list (not the sliced one) so each card's color still
// matches its real position — same lookup used by the event's own detail
// page and the "Autres évènements" section (see app/utils/eventPalette.ts).
const route = useRoute()
const isHome = computed(() => {
  const slug = route.params.slug
  return !slug || (Array.isArray(slug) && slug.length === 0)
})
const isAgenda = computed(() => route.path === '/agenda')

// "Y-m-d" strings compare correctly as plain strings, no Date parsing
// needed — today's own date counts as upcoming, not archived yet.
const todayIso = new Date().toISOString().slice(0, 10)
function isPast(date: string | null) {
  return !!date && date < todayIso
}

const withIndex = computed(() => (events.value ?? []).map((event, index) => ({ event, index })))

// Past events never show in the normal "upcoming" grid (home teaser or
// /agenda's own list) — they only live in the Archives section below,
// built from the same /api/events data instead of a separate Panel-managed
// block, since there's nothing for an editor to configure here.
const upcomingEvents = computed(() => withIndex.value.filter(({ event }) => !isPast(event.date)))

// Type filter — /agenda only (see template). "all" is the default/initial
// selection, matching every event; any other value matches event.type
// exactly (see TYPE_FILTERS below, keyed the same as TYPE_LABELS/the CMS's
// own event_type select options).
const selectedType = ref('all')
const filteredUpcomingEvents = computed(() =>
  selectedType.value === 'all'
    ? upcomingEvents.value
    : upcomingEvents.value.filter(({ event }) => event.type === selectedType.value)
)

const displayedEvents = computed(() => isHome.value ? upcomingEvents.value.slice(0, 5) : filteredUpcomingEvents.value)

// The "à la une" event renders as its own full-width row, separate from the
// grid of the other cards below, everywhere EXCEPT the home teaser — there
// it's simply the grid's own first item instead (spanning its first 2
// columns, see .grid--with-featured) — see template.
const featuredEvent = computed(() => displayedEvents.value[0] ?? null)
const restEvents = computed(() => displayedEvents.value.slice(1))
const gridEvents = computed(() => isHome.value ? displayedEvents.value : restEvents.value)

const archivedEvents = computed(() =>
  withIndex.value
    .filter(({ event }) => isPast(event.date))
    // Most recent first — the natural reading order for a past-events list.
    .sort((a, b) => (b.event.date ?? '').localeCompare(a.event.date ?? ''))
)

const archiveYears = computed(() => {
  const years = new Set(archivedEvents.value.map(({ event }) => new Date(event.date!).getFullYear()))
  return [...years].sort((a, b) => b - a)
})

const selectedYear = ref<number | null>(null)
watchEffect(() => {
  if (selectedYear.value === null && archiveYears.value.length) {
    selectedYear.value = archiveYears.value[0]
  }
})

const archiveEventsForYear = computed(() =>
  archivedEvents.value.filter(({ event }) => new Date(event.date!).getFullYear() === selectedYear.value)
)

const TYPE_LABELS: Record<string, string> = {
  concert: 'Concerts',
  'table-ronde': 'Rencontres',
  autre: 'Autres événements'
}

function eventTypeLabel(type: string) {
  return TYPE_LABELS[type] ?? type
}

// Filter pills — /agenda only (see template). "all" first, then every
// event_type option in the same order as the CMS's own select (see
// jav.cms/site/blueprints/pages/event_item.yml).
const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))
]

function formatEventDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Each card cycles through one of these (background, accent) pairs — the
// accent drives the title/date/divider/description color (via UiCard's
// `color`, inherited as currentColor) and the tag border. Buttons on
// non-featured cards invert the pair (accent background, base text) so
// they stand out against the card's own flat background; the featured
// card's button sits on its photo instead, so it just reuses the pair
// as-is (no inversion needed for contrast there). Shared with the event's
// own detail page (see app/utils/eventPalette.ts) so its color matches
// this card exactly.
const palette = eventPalette

// Light top-fade over an event's photo, in that same event's own color, so
// the date/tag overlaid on it stay legible against any photo — subtle
// (0.55 alpha fading to fully transparent) rather than a flat color block.
function photoGradient(index: number) {
  const rgb = rgbForBrandVar(palette(index).bg)
  const from = rgb ? `rgba(${rgb}, 0.55)` : palette(index).bg
  return `linear-gradient(to bottom, ${from}, transparent)`
}
</script>

<style lang="scss" scoped>
.v-block-concerts-event {
  // Only the section title (+ "Voir tout l'agenda" link, empty-state text)
  // follows the page's theme (see usePageTheme.ts) — the cards themselves
  // keep their own fixed 5-color cycling palette (see PALETTE above),
  // untouched, since each card sets its own color explicitly via UiCard.
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
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
}

// Home teaser only — the featured event is this grid's own first item
// instead of a separate row above it (see gridEvents/isHome in the
// template), spanning its first 2 columns.
.v-block-concerts-event__grid--with-featured .v-block-concerts-event__card:first-child {
  grid-column: span 2;

  @media (max-width: 700px) {
    grid-column: span 1;
  }
}

// Same pill visual language as .archive-year below — "All" starts active by
// default (selectedType's own initial value).
.v-block-concerts-event__filter {
  @include type-label;
  background: transparent;
  color: var(--color-page-accent);
  border: 2px solid var(--color-page-accent);
  border-radius: var(--radius-pill, 999px);
  padding: var(--spacing-xs) var(--spacing-l);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &.is-active {
    background: var(--color-page-accent);
    color: var(--color-brand-00);
  }
}

// Every card's text (date, title, divider, description) is set via UiCard's
// `color` prop (the palette's "accent"), inherited here as currentColor —
// no per-card color rule needed anywhere below.
.v-block-concerts-event__card {
  min-height: 440px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
}

.v-block-concerts-event__card--featured {
  min-height: 505px;
}

.v-block-concerts-event__card-content {
  flex: 1;
  padding: var(--spacing-xl);
}

// A <span>, not a <p> — this uses type-tag-date (uppercase), unlike a <p>'s
// canonical style.
.v-block-concerts-event__card-date {
  @include type-tag-date;
}

// A real <h3> (family/weight/size/line-height from typo.scss, color from
// UiCard) — but titles vary between one and three lines, which would
// otherwise shift the description/divider/button below it out of
// alignment between cards in the same row. Reserving space for the
// longest realistic case (3 lines × 40px font-size, line-height 1) up
// front keeps everything below the title starting at the same height
// regardless of the title's own length.
.v-block-concerts-event__card-title {
  min-height: 120px;
}

.v-block-concerts-event__card-description {
  @include type-body-large-bold;

  :deep(p) {
    margin: 0;
  }
}

// "À la une" (first) card's photo pane — side-by-side with the text pane,
// not stacked (see .card-photo below for every other card's own treatment).
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

// Light top-fade over any event photo (see photoGradient()) — sits between
// the photo and the date/tag overlaid on it, in the featured card's media
// pane as well as every other photo card below.
.v-block-concerts-event__card-gradient {
  position: absolute;
  inset: 0;
  height: 65%;
  pointer-events: none;
}

// Photo variant (event has a cover image, not the featured card) —
// full-bleed photo on top, date + tag overlaid on it, colored panel
// underneath with title/description/CTA.
.v-block-concerts-event__card-photo {
  position: relative;
  flex: 0 0 340px;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-concerts-event__card-photo-date {
  @include type-tag-date;
  position: absolute;
  top: var(--spacing-m);
  left: var(--spacing-m);
}

.v-block-concerts-event__card-photo-tag {
  position: absolute;
  top: var(--spacing-m);
  right: var(--spacing-m);
}

.v-block-concerts-event__card-panel {
  padding: var(--spacing-xl);
  flex: 1;
}

// Colors come from the inline --button-color/--button-text set per card in
// the template (see `palette()`) — the outline-on-hover behavior itself is
// now UiButton's own default for the "primary" variant (see UiButton.vue),
// applied site-wide, so nothing extra is needed here anymore.
.v-block-concerts-event__card-cta {
  position: relative;
}

// Real <p> — font comes from typo.scss's bare tag rule (Inter body-large).
.v-block-concerts-event__empty {
  opacity: 0.7;
}

.v-block-concerts-event__archive {
  padding-top: var(--spacing-4xl);
}

.v-block-concerts-event__archive-year {
  @include type-label;
  background: transparent;
  color: var(--color-page-accent);
  border: 2px solid var(--color-page-accent);
  border-radius: var(--radius-pill, 999px);
  padding: var(--spacing-xs) var(--spacing-l);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &.is-active {
    background: var(--color-page-accent);
    color: var(--color-brand-00);
  }
}

.v-block-concerts-event__archive-row {
  padding-block: var(--spacing-m);
  text-decoration: none;
  color: inherit;
}

.v-block-concerts-event__archive-date {
  @include type-tag-date;
  flex-shrink: 0;
}

.v-block-concerts-event__archive-title {
  @include type-body-large-bold;
  flex: 1;
}

.v-block-concerts-event__archive-arrow {
  font-size: 24px;
  flex-shrink: 0;
}
</style>
