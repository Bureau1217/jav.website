<template>
  <span
    class="ui-tag"
    :style="color ? { '--ui-tag-color': color } : undefined"
  ><slot /></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Explicit color override — defaults to inheriting currentColor. */
  color?: string
}>(), {
  color: undefined
})
</script>

<style lang="scss" scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  color: var(--ui-tag-color, currentColor);
  border: 2px solid var(--ui-tag-color, currentColor);
  border-radius: var(--radius-s);
  padding: var(--spacing-xs) var(--spacing-s);
  @include text-label;
}
</style>
