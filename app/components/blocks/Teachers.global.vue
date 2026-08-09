<template>
  <div class="v-block-teachers">
    <NuxtLink
      v-for="teacher in block.teacherPages"
      :key="teacher.id"
      :to="`/${teacher.id}`"
      class="v-block-teachers__item"
    >
      <img v-if="teacher.photo" :src="teacher.photo.url" :alt="teacher.photo.alt ?? teacher.title">
      <span class="v-block-teachers__name">{{ teacher.title }}</span>
      <span v-if="teacher.fonction" class="v-block-teachers__fonction">{{ teacher.fonction }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-teachers {
}
</style>
