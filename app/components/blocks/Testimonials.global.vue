<template>
  <div class="v-block-testimonials">
    <!-- Point d'ancrage : contenu dynamique "citations alumni et étudiant·e·xs" à implémenter -->
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-testimonials {
}
</style>
