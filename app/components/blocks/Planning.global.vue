<template>
  <div class="v-block-planning">
    <section
      v-for="(day, index) in block.content.planning_items"
      :key="index"
      class="v-block-planning__day"
    >
      <h3>{{ dayLabel(day.day) }}</h3>
      <ul>
        <li v-for="(course, courseIndex) in day.courses" :key="courseIndex">
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
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl) var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-planning__day {
  border-top: 2px solid var(--color-brand-04);
  padding: var(--spacing-m) 0;

  &:last-child {
    border-bottom: 2px solid var(--color-brand-04);
  }

  h3 {
    @include text-label;
    text-transform: none;
    margin-bottom: var(--spacing-s);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  li {
    display: flex;
    gap: var(--spacing-xl);
    @include text-body-large;
  }
}

.v-block-planning__time {
  flex-shrink: 0;
  min-width: 140px;
  font-weight: 700;
}
</style>
