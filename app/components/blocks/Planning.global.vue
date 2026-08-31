<template>
  <div class="v-block-planning u-flex u-flex--column">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <section
      v-for="(day, index) in block.content.planning_items"
      :key="index"
      class="v-block-planning__day"
    >
      <h3>{{ dayLabel(day.day) }}</h3>
      <ul class="u-flex u-flex--column u-gap-xs">
        <li v-for="(course, courseIndex) in day.courses" :key="courseIndex" class="u-flex u-gap-xl">
          <span class="v-block-planning__time">
            {{ course['time-tart'] }} – {{ course['time-end'] }}
          </span>
          <span>{{ course.title }}</span>
        </li>
      </ul>
    </section>
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
</script>

<style lang="scss" scoped>
.v-block-planning {
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-planning__day {
  border-top: 2px solid var(--color-brand-04);
  padding: var(--spacing-m) 0;

  &:last-child {
    border-bottom: 2px solid var(--color-brand-04);
  }

  h3 {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: var(--spacing-m); // 16px — this h3 is styled as a day label, not a heading-3
    line-height: 1;
    margin-bottom: var(--spacing-s);
  }

  li {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 24px;
    line-height: 1;
  }
}

.v-block-planning__time {
  flex-shrink: 0;
  min-width: 140px;
  font-weight: 700;
}
</style>
