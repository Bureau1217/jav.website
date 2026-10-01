<template>
  <div class="v-block-gallery u-flex u-flex--column u-flex--align-center u-gap-xl u-gutter-x">
    <UiSectionHeader :title="block.content.title || 'JAV en image'" class="v-block-gallery__header" />

    <div
      class="v-block-gallery__body u-flex u-flex--column u-flex--align-center u-gap-4xl"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div v-if="current" class="v-block-gallery__media">
        <component
          :is="current.link ? 'a' : 'div'"
          v-if="currentImage"
          :href="current.link || undefined"
          :target="current.link ? '_blank' : undefined"
          :rel="current.link ? 'noopener' : undefined"
          class="v-block-gallery__image-wrap"
        >
          <img
            :src="currentImage.url"
            :alt="currentImage.alt ?? current.title ?? ''"
            class="v-block-gallery__image"
            :style="{ objectPosition: objectPosition(currentImage) }"
          >
          <img v-if="current.link" src="/img/play-button.svg" alt="" aria-hidden="true" class="v-block-gallery__play">
        </component>
      </div>

      <div v-if="current" class="v-block-gallery__carousel u-flex u-flex--column u-flex--align-center u-gap-s">
        <!-- Arrows live in their own row, sized only by the title (always
             short) — not by .v-block-gallery__text below, so however many
             lines the current item's text wraps to, it never moves them. -->
        <div class="v-block-gallery__title-row">
          <button
            v-if="items.length > 1"
            type="button"
            class="v-block-gallery__arrow v-block-gallery__arrow--prev"
            aria-label="Élément précédent"
            @click="prev"
          />

          <div v-if="current.title" class="v-block-gallery__title">{{ current.title }}</div>

          <button
            v-if="items.length > 1"
            type="button"
            class="v-block-gallery__arrow v-block-gallery__arrow--next"
            aria-label="Élément suivant"
            @click="next"
          />
        </div>

        <div v-if="current.content" class="v-block-gallery__text" v-html="current.content" />
      </div>

      <div v-if="items.length > 1" class="v-block-gallery__dots u-flex u-gap-s">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="v-block-gallery__dot"
          :class="{ 'is-active': index === activeIndex }"
          :aria-label="`Aller à l'élément ${index + 1}`"
          @click="activeIndex = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
}>()

const items = computed(() => (props.block.content.items ?? []) as Array<{
  title?: string
  content?: string
  image?: string[]
  link?: string
}>)

const activeIndex = ref(0)
const current = computed(() => items.value[activeIndex.value])

// Items pick their image from anywhere on the site (a file:// UUID), not
// just from files uploaded to this page — so the block's own resolved
// itemImages (see server/utils/kqlPageQuery.ts) is the primary source.
// resolveKqlFile against the page's own images/files is kept as a fallback
// for the (rare) case an image was actually uploaded straight to this page.
const currentImage = computed(() =>
  props.block.itemImages?.[activeIndex.value]?.image
  ?? resolveKqlFile(current.value?.image, props.images)
)

function prev() {
  if (items.value.length < 2) return
  activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
}

function next() {
  if (items.value.length < 2) return
  activeIndex.value = (activeIndex.value + 1) % items.value.length
}

// Swipe to navigate — the prev/next arrows are hidden below the mobile
// breakpoint (see .v-block-gallery__arrow), leaving only the dots to switch
// items by tap; this adds a horizontal swipe over the whole body (image,
// title, text) as a more natural way to browse on touch devices. A plain
// horizontal delta past the threshold triggers prev/next; it's discarded
// whenever the vertical delta is larger, so a vertical scroll gesture that
// starts over the gallery never gets mistaken for a swipe.
const SWIPE_THRESHOLD = 40
let touchStartX = 0
let touchStartY = 0

function onTouchStart(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

function onTouchEnd(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch) return
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return
  if (deltaX < 0) {
    next()
  } else {
    prev()
  }
}
</script>

<style lang="scss" scoped>
.v-block-gallery {
  background: var(--color-page-accent);
  color: var(--color-brand-00);
  padding-block: var(--block-spacing);
}

// Full width, like .ui-section-header above it — so it doesn't shrink to
// fit its own content and instead lets .v-block-gallery__media's own
// max-width (below) govern how wide the media actually renders.
.v-block-gallery__body {
  width: 100%;
  // Keep vertical page scroll working over the gallery, but hand horizontal
  // gestures to the swipe handler above instead of any browser-default
  // horizontal panning (e.g. back/forward swipe navigation on some
  // mobile browsers) that would otherwise compete with it.
  touch-action: pan-y;
}

.v-block-gallery__media {
  width: 100%;
  max-width: 1096px;
}

.v-block-gallery__image-wrap {
  position: relative;
  display: block;
}

.v-block-gallery__image {
  width: 100%;
  aspect-ratio: 1096 / 471;
  object-fit: cover;
  border-radius: 999px;

  // Taller and bigger on mobile — the desktop ratio is a wide, short strip,
  // which leaves very little actual photo on a narrow screen. A fixed
  // --radius-l here (instead of the desktop 999px pill) rounds just the top
  // and bottom corners like a normal rounded rectangle, since 999px would
  // otherwise force the now-much-taller image into a full vertical stadium
  // shape, curving its left/right sides in too.
  @media (max-width: $breakpoint-mobile) {
    aspect-ratio: 3 / 4;
    border-radius: 150px;
  }
}

// Only shown when the item's "Lien" field is filled — signals the image is
// clickable and leads to that link (e.g. a video hosted elsewhere), instead
// of embedding a player straight in the page.
.v-block-gallery__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 88px;
  height: 88px;
  pointer-events: none;

  @media (max-width: $breakpoint-mobile) {
    width: 56px;
    height: 56px;
  }
}

// Same max-width as .v-block-gallery__media above, so the arrows always
// sit at the overall block's own edges (image-width) instead of right next
// to the text.
.v-block-gallery__carousel {
  width: 100%;
  max-width: 1096px;
}

// The arrows' own positioning context — sized only by the title (a single
// short line), not by .v-block-gallery__text below it. That's what keeps
// them from jumping up/down depending on how many lines the current item's
// text wraps to: this row's own height never changes, text is free to grow
// as tall as it needs to underneath without affecting it. min-height covers
// the (rare) item with no title at all, so the row — and the arrows — don't
// collapse to nothing.
.v-block-gallery__title-row {
  position: relative;
  width: 100%;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Prev/next carousel controls — a mask-image (not <img>) so the icon
// inherits --color-brand-00 via currentColor, same pattern as
// TheHeader.vue's nav-arrow and Resources.global.vue's download/link icons.
// "prev" is just "next" mirrored horizontally, not a separate asset.
// Pinned to the title row's own left/right edges (see
// .v-block-gallery__title-row above), vertically centered against the
// title specifically — not the whole carousel — so the text below is free
// to vary without moving them.
.v-block-gallery__arrow {
  position: absolute;
  top: 50%;
  flex-shrink: 0;
  width: 32px;
  height: 24px;
  background: transparent;
  background-color: currentColor;
  border: none;
  color: var(--color-brand-00);
  cursor: pointer;
  mask-image: url('/img/inconsnext.svg');
  -webkit-mask-image: url('/img/inconsnext.svg');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;

  // The dots below still let you navigate on mobile — the arrows are
  // dropped there instead of just shrunk, same reasoning as the play button
  // scaling down rather than this pair, since there's no room for them
  // beside the title without crowding it.
  @media (max-width: $breakpoint-mobile) {
    display: none;
  }
}

.v-block-gallery__arrow--prev {
  left: 0;
  transform: translateY(-50%) scaleX(-1);
}

.v-block-gallery__arrow--next {
  right: 0;
  transform: translateY(-50%);
}

// A <div>, not a <p> — this uses type-text-heading-1 (Inter 700/32px),
// unlike a <p>'s canonical style (type-body-large, 500/24px).
.v-block-gallery__title {
  @include type-text-heading-1;
  text-align: center;
  // Keeps clear of the arrows, pinned to the title row's own far edges (see
  // .v-block-gallery__arrow above) instead of sitting right next to the
  // title — otherwise a long title could run underneath them.
  padding-inline: var(--spacing-3xl);

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
    // No arrows to clear on mobile anymore (see .v-block-gallery__arrow
    // above) — this padding would just leave the title looking off-center.
    padding-inline: 0;
  }
}

.v-block-gallery__text {
  @include type-body-large;
  text-align: center;
  max-width: 676px;
  margin: 0 auto;

  @media (max-width: $breakpoint-mobile) {
    font-size: 18px;
  }
}

.v-block-gallery__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-brand-00);
  opacity: 0.35;
  border: none;
  padding: 0;
  cursor: pointer;

  // Active dot gets a real accent color (mint, white on some pages — see
  // usePageTheme.ts) instead of just full opacity on the same white, so it
  // actually stands out against the others.
  &.is-active {
    background: var(--color-page-on-accent);
    opacity: 1;
  }
}
</style>
