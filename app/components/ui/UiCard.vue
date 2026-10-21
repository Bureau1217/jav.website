<template>
  <component
    :is="tag"
    class="ui-card"
    :class="{ 'ui-card--bordered': bordered }"
    :style="cardStyle"
    :to="to"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * The rounded colored/bordered panel shape reused across cards, teasers
 * and callouts (event cards, teacher cards, CTA blocks, the audio player,
 * the floating promo...). It only owns the shell — background, text color,
 * radius, optional border — every consumer arranges its own internal
 * layout via the default slot, since that varies block to block.
 */
const props = withDefaults(defineProps<{
  /** Background color/CSS value. Omit for a transparent shell (e.g. bordered-only). */
  background?: string
  /** Text color for the card's content — also used as the border color when `bordered`. */
  color?: string
  /** Adds a 2px solid border in `color` instead of (or alongside) a background. */
  bordered?: boolean
  /** When set, renders the card as a NuxtLink instead of a div (e.g. a teacher card). */
  to?: string
}>(), {
  background: undefined,
  color: undefined,
  bordered: false,
  to: undefined
})

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'))

const cardStyle = computed(() => ({
  ...(props.background ? { '--ui-card-bg': props.background } : {}),
  ...(props.color ? { '--ui-card-color': props.color } : {})
}))
</script>

<style lang="scss" scoped>
.ui-card {
  background: var(--ui-card-bg, transparent);
  color: var(--ui-card-color, inherit);
  border-radius: var(--radius-m);
  overflow: hidden;
}

.ui-card--bordered {
  border: 2px solid var(--ui-card-color, currentColor);
}
</style>
