<template>
  <span
    class="ui-divider"
    :class="[`ui-divider--${variant}`, `ui-divider--${orientation}`]"
    :style="color ? { '--ui-divider-color': color } : undefined"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** "thick" = rounded pill bar (the design system's signature divider), "thin" = 2px hairline. */
  variant?: 'thick' | 'thin'
  orientation?: 'horizontal' | 'vertical'
  /**
   * Explicit color override. Most of the time you don't need this — the
   * divider inherits `currentColor` from whatever text color the parent
   * block already sets, which matches the design in almost every case.
   */
  color?: string
}>(), {
  variant: 'thick',
  orientation: 'horizontal',
  color: undefined
})
</script>

<style lang="scss" scoped>
.ui-divider {
  display: block;
  flex-shrink: 0;
  background: var(--ui-divider-color, currentColor);
}

.ui-divider--thick.ui-divider--horizontal {
  width: 100%;
  height: var(--divider-thick-size);
  border-radius: var(--radius-pill);
}

.ui-divider--thick.ui-divider--vertical {
  height: 100%;
  width: var(--divider-thick-size);
  border-radius: var(--radius-pill);
}

.ui-divider--thin.ui-divider--horizontal {
  width: 100%;
  height: var(--divider-thin-size);
}

.ui-divider--thin.ui-divider--vertical {
  height: 100%;
  width: var(--divider-thin-size);
}
</style>
