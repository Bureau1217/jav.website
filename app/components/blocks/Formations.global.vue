<template>
  <div class="v-block-formations">
    <!-- Point d'ancrage : contenu dynamique "formations" à implémenter -->
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-formations {
}
</style>
