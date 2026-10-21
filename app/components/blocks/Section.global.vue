<template>
  <section class="v-block-section u-flex u-flex--column">
    <div class="v-block-section__header u-flex u-flex--column u-gap-m u-gutter-x">
      <div class="v-block-section__row u-flex u-flex--align-start u-flex--justify-between u-gap-xl">
        <h1 v-if="block.content.title" v-html="block.content.title" />
        <button
          v-if="hasContent"
          type="button"
          class="v-block-section__toggle"
          :class="{ 'is-open': isOpen }"
          :aria-expanded="isOpen"
          @click="isOpen = !isOpen"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        v-if="tagList.length || block.content.link?.link_url"
        class="v-block-section__row u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap"
      >
        <div v-if="tagList.length" class="v-block-section__tags u-flex u-gap-s u-flex--wrap">
          <UiTag v-for="tag in tagList" :key="tag">{{ tag }}</UiTag>
        </div>
        <UiButton
          v-if="block.content.link?.link_url"
          :to="block.content.link.link_url"
          class="v-block-section__link"
        >
          {{ block.content.link.link_text }}
        </UiButton>
      </div>

      <p v-if="block.content.text" class="v-block-section__text" v-html="block.content.text" />
    </div>

    <div v-if="hasContent" v-show="isOpen" class="v-block-section__content">
      <Blocks :blocks="parsedContent" :images="images" :files="files" />
    </div>

    <!-- Sits right after the header when closed (the content div above is
         v-show'd to zero height), and after the expanded content when
         open — same element, its position just follows whatever is
         actually visible above it. This is the block's only divider (no
         matching one at the top) so two Section blocks stacked back to
         back share a single line instead of two with a gap between them. -->
    <div class="u-gutter-x">
      <UiDivider />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
}>()

// Closed by default — this header (title, tags, link, text) is the
// "collapsed" state shown in the design; only the nested block content
// below it expands/collapses.
const isOpen = ref(false)

const parsedContent = computed(() => parseKqlBlocks(props.block.content.content))
const hasContent = computed(() => parsedContent.value.length > 0)

// Kirby's "tags" field stores its raw value as a single comma-separated
// string (not an array) — split it into pills.
const tagList = computed(() => {
  const raw = props.block.content.tags
  if (!raw) return []
  return String(raw).split(',').map((tag: string) => tag.trim()).filter(Boolean)
})
</script>

<style lang="scss" scoped>
.v-block-section {
  color: var(--color-page-accent);
  gap: var(--spacing-m);
  padding-top: 0;
  padding-bottom: var(--spacing-7xl);

  @media (max-width: $breakpoint-mobile) {
    padding-bottom: var(--spacing-4xl);
  }
}

.v-block-section__header {
  padding-block: var(--spacing-xl);
}

.v-block-section__link {
  --button-color: var(--color-page-accent);
  --button-text: var(--color-brand-00);
}

// Real <p> — no local font override needed, typo.scss's bare tag rule
// covers it entirely (Inter body-large).

// "+" that becomes a "−" when open (the vertical bar shrinks away, the
// horizontal one stays) — a plain button since the header also holds a
// real link (can't wrap the whole header in a <summary>/<details> without
// that link fighting the toggle for clicks). Distinct from the FAQ
// (Toggle) block's icon, which rotates into an "×" instead.
.v-block-section__toggle {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: currentColor;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 100%;
    height: 3px;
  }

  &::after {
    width: 3px;
    height: 100%;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  &.is-open::after {
    transform: translate(-50%, -50%) scaleY(0);
    opacity: 0;
  }
}

.v-block-section__content {
  padding-block: var(--spacing-xl);
  // Nested blocks (rendered via <Blocks> above) sit inside an accordion —
  // they don't need the full page-level 96px rhythm between them, so this
  // scopes --block-spacing down to 48px for every block rendered inside,
  // no per-block changes needed (see grid.scss for the variable itself).
  --block-spacing: var(--spacing-4xl);
  // Same idea for their "Titre de la section" (h1) — 32px instead of the
  // usual 52px once nested inside an open Section.
  --heading-1-size: 32px;
}
</style>
