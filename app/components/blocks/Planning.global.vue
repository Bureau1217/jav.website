<template>
  <div class="v-block-planning u-flex u-flex--column u-gap-xl u-gutter">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-planning__body u-flex u-flex--column u-gap-xl">
      <UiDivider variant="thin" />
      <template v-for="(day, index) in block.content.planning_items" :key="index">
        <div class="v-block-planning__day u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
          <div class="v-block-planning__day-label">{{ dayLabel(day.day) }}</div>
          <div class="v-block-planning__courses u-flex u-gap-m u-flex--wrap">
            <span
              v-for="(course, courseIndex) in day.courses"
              :key="courseIndex"
              class="v-block-planning__course"
            >
              {{ course.title }} {{ formatTime(course['time-tart']) }}–{{ formatTime(course['time-end']) }}
            </span>
          </div>
        </div>
        <UiDivider variant="thin" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
}

function dayLabel(day: string): string {
  return DAY_LABELS[day] ?? day
}

// Kirby's time field comes back as "14:00:00" — French time notation is
// "14h" (no minutes shown when on the hour) or "14h30".
function formatTime(time: string | undefined): string {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  return minutes === '00' ? `${hours}h` : `${hours}h${minutes}`
}
</script>

<style lang="scss" scoped>
.v-block-planning {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

// Day name + its course pills on one row (UiDivider above and below each —
// see template, one before the loop plus one after every row). Spacing
// between rows/dividers comes purely from the body's own 24px gap now, not
// from padding here, so every "text block" (Planning, Resources, Toggle,
// Tableau avec colonnes...) shares the exact same 24px rhythm.
.v-block-planning__day {
}

// A <div>, not a <h3> — this diverges from h3's canonical style (GT Maru
// heading-3, see typo.scss) on purpose, so it isn't tagged as one. Doesn't
// map to a named type style either — day names ("Lundi") must keep normal
// casing, and every uppercase-label style in the scale (label/tag-date)
// would force-uppercase them.
.v-block-planning__day-label {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 24px; // same size as running text (p) everywhere else in the block
  line-height: 1;
}

.v-block-planning__course {
  @include type-body;
  font-size: 24px; // same size as running text (p) everywhere else in the block
  background: var(--color-brand-05);
  border-radius: var(--radius-pill);
  padding: var(--spacing-s) var(--spacing-l);
  white-space: nowrap;
}
</style>
