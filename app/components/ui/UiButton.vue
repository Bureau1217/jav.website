<template>
  <component
    :is="tag"
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :to="isLink ? to : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    :type="isLink ? undefined : type"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Visual style: filled pill (primary) or underlined text link (secondary). */
  variant?: 'primary' | 'secondary'
  /** Text size, matches the design system's button-m / button-xl scale. */
  size?: 'm' | 'xl'
  /**
   * Destination — internal or external, NuxtLink handles both. Omit to
   * render a plain <button> instead (e.g. form submit, JS-only actions).
   */
  to?: string
  /** Force target="_blank" + rel="noopener" — e.g. social links, PDFs. */
  external?: boolean
  /** Native button type, used when `to` is not set. */
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  size: 'm',
  to: undefined,
  external: false,
  type: 'button'
})

const isLink = computed(() => Boolean(props.to))
const tag = computed(() => (isLink.value ? resolveComponent('NuxtLink') : 'button'))
</script>

<style lang="scss" scoped>
// Typography comes from the shared button-m / button-xl / button-link
// mixins (assets/_tokens.scss) so it can never drift from the rest of the
// design system's type scale — only layout/color/spacing live here.
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
}

.ui-button--primary {
  background: var(--button-color);
  color: var(--button-text);
  border-radius: var(--radius-pill);
  padding: var(--spacing-xs) var(--spacing-m);
}

.ui-button--secondary {
  background: transparent;
  color: inherit;
  border-bottom: 2px solid currentColor;
  padding-bottom: 2px;
  border-radius: 0;
  @include button-link;
}

.ui-button--primary.ui-button--m {
  @include button-m;
}

.ui-button--primary.ui-button--xl {
  @include button-xl;
}
</style>
