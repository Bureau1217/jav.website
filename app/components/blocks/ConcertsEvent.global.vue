<template>
  <div class="v-block-concerts-event">
    <!-- Point d'ancrage : contenu dynamique "concerts et événements" à implémenter -->
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-concerts-event {
}
</style>
