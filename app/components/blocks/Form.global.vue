<template>
  <div class="v-block-form" :data-form-type="block.content.form_type">
    <!-- Point d'ancrage : formulaire "{{ block.content.form_type }}" à implémenter -->
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-form {
}
</style>
