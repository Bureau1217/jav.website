<template>
  <component
    :is="tag"
    class="ui-button u-inline-flex u-flex--align-center u-flex--justify-center u-gap-xs"
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
// "secondary" reuses the shared type-body-large mixin (typo.scss); the
// "primary" m/xl sizes below are the button component's own scale (20px/
// 24px, both weight 800) — not part of the shared content type scale, kept
// as explicit values on purpose.
.ui-button {
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

// Every filled/pill button site-wide (event cards, CTA blocks, forms...)
// switches to outline-only on hover — fond transparent, texte/bordure dans
// --button-color — same treatment as ConcertsEvent.global.vue's "En savoir
// plus" originally had, now centralized here so it applies everywhere. A
// transparent border is reserved at all times (not just on :hover) so the
// button doesn't change size when that border becomes visible on hover.
.ui-button--primary {
  background: var(--button-color);
  color: var(--button-text);
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  padding: var(--spacing-xs) var(--spacing-m);
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: transparent;
    color: var(--button-color);
    border-color: var(--button-color);
  }
}

.ui-button--secondary {
  @include type-body-large;
  background: transparent;
  color: inherit;
  border-bottom: 2px solid currentColor;
  padding-bottom: 2px;
  border-radius: 0;

  &:hover {
    opacity: 0.85;
  }
}

.ui-button--primary.ui-button--m {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 24px; // same size as running text (p) everywhere else
  line-height: 1;
}

.ui-button--primary.ui-button--xl {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 24px;
  line-height: 1;
}
</style>
