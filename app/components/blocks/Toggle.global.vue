<template>
  <div class="v-block-toggle u-flex u-flex--column">
    <UiSectionHeader
      v-if="block.content.title"
      :title="block.content.title"
      :link-to="block.content.link?.link_url"
      :link-text="block.content.link?.link_text"
    />
    <template v-for="(item, index) in block.content.items" :key="index">
      <UiDivider v-if="index > 0" variant="thin" />
      <details class="v-block-toggle__item">
        <summary class="u-flex u-flex--align-center u-flex--justify-between u-gap-5xl" @click.prevent="toggle">
          <h3 class="v-block-toggle__title">{{ item.titre }}</h3>
          <span class="v-block-toggle__icon" aria-hidden="true" />
        </summary>
        <div class="v-block-toggle__content" v-html="item.contenu" />
      </details>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

const DURATION = 350
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

// A native <details> snaps open/closed instantly (the content is simply
// display:none when closed, so there's nothing to transition). The click is
// intercepted instead: on open, `open` is set first and the content's
// height/opacity animate up from 0; on close, they animate down to 0 and
// `open` is only removed once that finishes. Falls back to the plain
// instant toggle for visitors who prefer reduced motion.
function toggle(event: MouseEvent) {
  const summary = event.currentTarget as HTMLElement
  const details = summary.parentElement as HTMLDetailsElement
  const content = details.querySelector<HTMLElement>('.v-block-toggle__content')
  if (!content) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    details.open = !details.open
    return
  }

  // A click mid-animation reverses from wherever it is, not from scratch.
  content.getAnimations().forEach(animation => animation.cancel())
  content.style.overflow = 'hidden'

  const collapsed = { height: '0px', paddingTop: '0px', opacity: 0 }

  if (!details.open) {
    delete details.dataset.closing
    details.open = true
    const expanded = { height: `${content.offsetHeight}px`, paddingTop: getComputedStyle(content).paddingTop, opacity: 1 }
    const animation = content.animate([collapsed, expanded], { duration: DURATION, easing: EASING })
    animation.onfinish = animation.oncancel = () => { content.style.overflow = '' }
  } else {
    details.dataset.closing = ''
    const expanded = { height: `${content.offsetHeight}px`, paddingTop: getComputedStyle(content).paddingTop, opacity: 1 }
    const animation = content.animate([expanded, collapsed], { duration: DURATION, easing: EASING })
    animation.onfinish = () => {
      details.open = false
      delete details.dataset.closing
      content.style.overflow = ''
    }
    animation.oncancel = () => { content.style.overflow = '' }
  }
}
</script>

<style lang="scss" scoped>
.v-block-toggle {
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);
  color: var(--color-page-accent);
  gap: var(--spacing-xl);
}

.v-block-toggle__item {
  &[open] .v-block-toggle__icon {
    transform: rotate(45deg);
  }

  // While closing, `open` is still set until the animation ends — the "+"
  // turns back right away instead of after it.
  &[data-closing] .v-block-toggle__icon {
    transform: none;
  }
}

.v-block-toggle__item summary {
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

// Real <h3>, but overridden locally to Inter instead of the canonical h3
// (GT Maru, type-heading-3) — FAQ item titles use their own
// type-text-heading-3 (Inter 700/40px) instead.
.v-block-toggle__title {
  @include type-text-heading-3;
  // Smaller than the mixin's own 40px — item titles were reading too large.
  font-size: 32px;

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }

  flex: 1;
  // Without this, a flex item's default min-width:auto keeps it from
  // shrinking below its text's unconstrained intrinsic width — so a long
  // question didn't wrap within the available space and instead pushed the
  // icon (flex-shrink: 0) past the row's own edge, overflowing the whole
  // page horizontally on mobile.
  min-width: 0;
}

.v-block-toggle__icon {
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease;

  @media (max-width: $breakpoint-mobile) {
    width: 24px;
    height: 24px;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--color-page-accent);
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 100%;
    height: 3px;
  }

  &::after {
    width: 3px;
    height: 100%;
  }
}

.v-block-toggle__content {
  @include type-body-large;
  box-sizing: border-box;
  padding-top: var(--spacing-s);
}
</style>
