<template>
  <div class="v-block-planning u-flex u-flex--column u-gutter">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <UiDivider variant="thin" />
    <template v-for="(day, index) in block.content.planning_items" :key="index">
      <div class="v-block-planning__day u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <h3>{{ dayLabel(day.day) }}</h3>
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
  padding-block: var(--spacing-xl);
  color: var(--color-brand-06);
}

// Day name + its course pills on one row (UiDivider above and below each —
// see template, one before the loop plus one after every row).
.v-block-planning__day {
  padding-block: var(--spacing-l);

  h3 {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: var(--spacing-m); // 16px — styled as a day label, not a heading-3
    line-height: 1;
  }
}

.v-block-planning__course {
  background: var(--color-brand-05);
  border-radius: var(--radius-pill);
  padding: var(--spacing-s) var(--spacing-l);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 20px;
  line-height: 1;
  white-space: nowrap;
}
</style>
