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
}
</style>
