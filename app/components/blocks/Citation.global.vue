<template>
  <blockquote class="v-block-citation">
    <div class="v-block-citation__content" v-html="block.content.contenu" />
    <cite v-if="block.content.signature">{{ block.content.signature }}</cite>
  </blockquote>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-citation {
}
</style>
