<template>
  <div class="v-page-transition" :class="{ 'is-active': phase !== 'idle' }">
    <!-- The color panel is the only thing that moves — it slides right→left
         across the whole viewport. -->
    <div
      class="v-page-transition__panel"
      :class="`v-page-transition__panel--${phase}`"
      :style="{ background: theme.accent }"
      @transitionend="onPanelTransitionEnd"
    />
    <!-- The mark stays put, dead center, the entire time — same lockup as
         TheLoader.vue (same markup/positioning), just static: no draw/
         vibrate animation. It's clipped (see clip-path below) to exactly the
         colored area of the panel above, animated with the same duration/
         easing/direction as that panel's own transform — so instead of
         floating on top as an independent layer, the mark only ever becomes
         visible as the color sweeps across it, reading as if it were printed
         on the panel itself. Always rendered (no v-if) so the clip-path
         transition has a real "from" state to animate out of on every
         navigation, the same reason the panel below is never v-if'd either. -->
    <div class="v-page-transition__lockup-wrap" :class="`v-page-transition__lockup-wrap--${phase}`" :style="{ color: theme.onAccent }">
      <div class="v-page-transition__lockup">
        <svg class="v-page-transition__mark" viewBox="0 0 102.5 80.9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path v-for="d in logoJavBars" :key="d" class="v-page-transition__bar" :d="d" />
          <path v-for="d in logoJavStems" :key="d" class="v-page-transition__stem" :d="d" />
          <path v-for="d in logoJavSwirls" :key="d" class="v-page-transition__swirl" :d="d" />
        </svg>
        <div class="v-page-transition__tagline">
          <span>L’École</span>
          <span>des</span>
          <span>Musiques</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// A full-screen color "volet" (shutter) that sweeps right→left over a page
// change: it slides in to fully cover the outgoing page, the actual route
// swap happens while hidden behind it, then it keeps sliding the same
// direction off the left edge to reveal the new page underneath. The panel
// is colored to match the DESTINATION page's accent (see pageThemeForPath in
// usePageTheme.ts) so covering and revealing read as one continuous color,
// not a flash. The JAV mark + tagline (same lockup as TheLoader.vue, just
// static) stay fixed dead-center the whole time — it's only the color panel
// underneath/behind it that slides, not the logo.
//
// Timing is driven entirely by real events, not guessed durations — the
// earlier version blocked router.beforeEach on a fixed setTimeout(COVER_MS)
// before letting navigation proceed, which had nothing to do with how long
// the destination page actually took to load: on a fast connection it added
// a pointless flat delay, on a slow one it revealed too early if the fetch
// happened to still be running once that fixed timer ran out (Suspense
// would still block the actual content swap, but there was no guarantee the
// curtain itself had waited long enough to feel intentional). Now:
// - router.beforeEach starts the cover animation and returns `true`
//   immediately — navigation (and the destination page's own data fetch)
//   proceeds right away, in parallel with the curtain sliding in, instead
//   of being held back by a timer.
// - `coverAnimDone` flips true from the panel's own `transitionend` (the
//   cover slide has actually, physically finished on screen).
// - `pageReady` flips true from nuxtApp's 'page:finish' hook — fired once
//   the destination page's data has resolved and its content is what's on
//   screen (not router.afterEach, which fires as soon as the route itself
//   resolves, possibly before that data is ready).
// Only once BOTH are true — the real load time, whichever of the two ends
// up longer — does the reveal begin (after a short deliberate pause, not a
// wait for anything). The reveal's own end (back to 'idle') is likewise
// read from that transform's transitionend rather than a second timer.
const theme = ref(pageThemeForPath('/'))
const phase = ref<'idle' | 'cover' | 'reveal'>('idle')

const COVER_MS = 550 // visual speed of the slide — not a gating delay
const HOLD_MS = 120 // short deliberate pause once both are confirmed ready
const REVEAL_MS = 550

let coverAnimDone = false
let pageReady = false
let holdTimer: ReturnType<typeof setTimeout> | null = null

function clearHold() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
}

const router = useRouter()
const nuxtApp = useNuxtApp()

function maybeReveal() {
  if (phase.value !== 'cover' || !coverAnimDone || !pageReady) return
  holdTimer = setTimeout(() => {
    phase.value = 'reveal'
  }, HOLD_MS)
}

function onPanelTransitionEnd(event: TransitionEvent) {
  if (event.propertyName !== 'transform') return
  if (phase.value === 'cover') {
    coverAnimDone = true
    maybeReveal()
  } else if (phase.value === 'reveal') {
    phase.value = 'idle'
  }
}

const removeBeforeEachHook = router.beforeEach((to, from) => {
  // Skip the very first "navigation" (initial server-rendered load, where
  // `from` has no matched route yet) — TheLoader already owns that moment.
  if (from.matched.length === 0) return true

  clearHold()
  coverAnimDone = false
  pageReady = false
  theme.value = pageThemeForPath(to.path)
  phase.value = 'cover'

  return true
})

const removePageFinishHook = nuxtApp.hook('page:finish', () => {
  pageReady = true
  maybeReveal()
})

onScopeDispose(() => {
  clearHold()
  removeBeforeEachHook()
  removePageFinishHook()
})
</script>

<style lang="scss" scoped>
.v-page-transition {
  position: fixed;
  inset: 0;
  z-index: 9998; // just under TheLoader (9999), above everything else
  pointer-events: none;
  overflow: hidden;

  &.is-active {
    pointer-events: auto;
  }
}

.v-page-transition__panel {
  position: absolute;
  inset: 0;
  transform: translateX(100%);
  will-change: transform;
}

.v-page-transition__panel--cover {
  transition: transform v-bind('`${COVER_MS}ms`') cubic-bezier(0.65, 0, 0.35, 1);
  transform: translateX(0%);
}

.v-page-transition__panel--reveal {
  transition: transform v-bind('`${REVEAL_MS}ms`') cubic-bezier(0.65, 0, 0.35, 1);
  transform: translateX(-100%);
}

// Fixed dead-center, independent of the sliding panel above — same two-level
// structure as TheLoader.vue: an outer full-screen flex-center box, and an
// inner relative/inline-block pairing of mark+tagline (so the tagline's own
// absolute positioning below is relative to that pairing, not the whole
// screen).
//
// clip-path: inset(top right bottom left) on this same full-screen box is
// what makes the mark read as "inside" the panel instead of floating above
// it — the two keyframe values below trace exactly the colored region of
// the panel's own transform at any instant (worked out from translateX
// alone, since both boxes are the same full-viewport size, so percentages
// line up 1:1):
// - cover: panel's box spans [translateX%, translateX%+100%], translateX%
//   animating 100%→0% — intersected with the viewport [0,100%], the
//   visible colored strip is [translateX%, 100%]. inset()'s own "left"
//   value is exactly that left edge, so inset(0 0 0 100%) → inset(0 0 0 0%)
//   traces it.
// - reveal: translateX% continues 0%→-100%, so the panel's left edge is
//   now behind the viewport's own left edge (max(...,0%) = 0%) and its
//   right edge — translateX%+100% — is what's retreating, from 100% down
//   to 0%. inset()'s "right" value measures in from the opposite (right)
//   edge, so revealing less from the right as that edge retreats is
//   inset(0 0% 0 0) → inset(0 100% 0 0).
.v-page-transition__lockup-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: inset(0 0 0 100%); // fully hidden by default (idle)
  will-change: clip-path;
}

.v-page-transition__lockup-wrap--cover {
  transition: clip-path v-bind('`${COVER_MS}ms`') cubic-bezier(0.65, 0, 0.35, 1);
  clip-path: inset(0 0 0 0%);
}

.v-page-transition__lockup-wrap--reveal {
  transition: clip-path v-bind('`${REVEAL_MS}ms`') cubic-bezier(0.65, 0, 0.35, 1);
  clip-path: inset(0 100% 0 0);
}

.v-page-transition__lockup {
  position: relative;
  display: inline-block;
}

.v-page-transition__mark {
  display: block;
  width: 380px;
  height: auto;

  @media (max-width: $breakpoint-mobile) {
    width: 260px;
  }
}

// Same positioning as TheLoader's own `.v-loader__tagline` — see that
// file's comment for where the 7.4%/74.6% values come from (the actual
// coordinates of the wordmark paths in LOGO-JAV_FOOTER.svg).
.v-page-transition__tagline {
  position: absolute;
  top: 7.4%;
  right: 74.6%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  @include type-label;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.01em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 9px;
  }
}

.v-page-transition__bar,
.v-page-transition__stem,
.v-page-transition__swirl {
  fill: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .v-page-transition {
    display: none;
  }
}
</style>
