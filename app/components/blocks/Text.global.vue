<template>
  <div class="v-block-text" v-html="block.content.text" />
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-text {
}
</style>
