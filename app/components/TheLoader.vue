<template>
  <Transition name="v-loader-fade">
    <div v-if="isVisible" class="v-loader" role="status" aria-live="polite" aria-label="Chargement en cours">
      <!-- Mark + tagline positioned together the way they actually sit in
           LOGO-JAV_FOOTER.svg — the wordmark tucked to the icon's own
           upper-left corner, not centered underneath it. -->
      <div class="v-loader__lockup">
        <svg class="v-loader__mark" viewBox="0 0 102.5 80.9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- The 9 fanning bars — each "draws" open (scaleX 0→1, anchored on
               its own center so BOTH ends move, not just the left one) with a
               short stagger, then settles into its own small looping
               horizontal scaleX pulse once its draw-in finishes — the
               "equalizer/music vibration" look that was asked for. -->
          <path v-for="(d, i) in bars" :key="d" class="v-loader__bar" :style="{ '--i': i }" :d="d" />
          <!-- The two straight vertical stems — "draw" upward (scaleY 0→1
               from the bottom) instead of horizontally, since that's the
               direction that actually reads as a line being drawn for a
               vertical stroke. -->
          <path v-for="(d, i) in stems" :key="d" class="v-loader__stem" :style="{ '--i': i }" :d="d" />
          <!-- The two curved swirl shapes (the clef-like mark) — a directional
               draw doesn't read cleanly on a curve, so these simply scale +
               fade in instead. -->
          <path v-for="d in swirls" :key="d" class="v-loader__swirl" :d="d" />
        </svg>
        <div class="v-loader__tagline">
          <span>L’École</span>
          <span>des</span>
          <span>Musiques</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Full-screen brand loader shown once, on first entry to the site — see
// app/app.vue for where this is mounted. Always the site's default
// dark-green/mint pairing (brand-02/brand-01), not the current page's own
// theme, since it's meant to read as the JAV brand mark itself, the same
// regardless of which page happens to be the entry point.
// Visible from the very start — both on the server-rendered markup and the
// client's first paint, so it's already covering the page before there's
// anything underneath to flash.
const isVisible = ref(true)
// Previously also re-shown on every later client-side navigation (via
// Nuxt's page:start/page:finish hooks), so it worked like an in-between-
// pages transition — that was dropped: it should only ever greet someone
// arriving at the site, not reappear every time they click a link.
const HOLD_MS = 2200
let hideTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  hideTimer = setTimeout(() => {
    isVisible.value = false
    hideTimer = null
  }, HOLD_MS)
})

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})

// Path data lifted straight from public/img/LOGO-JAV_FOOTER.svg's main
// mark (the small "L'École des Musiques" wordmark paths are left out here —
// too fine-grained to read as anything once animated, the fan/stems/swirl
// below are what's actually recognizable as the JAV mark on its own, same
// icon used throughout the header).
const bars = [
  'M96.1,9.8H51.6c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h44.6c1.3,0,2.4,1.1,2.4,2.4C98.6,8.8,97.5,9.8,96.1,9.8',
  'M93.5,18.1H54.2c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h39.3c1.3,0,2.4,1.1,2.4,2.4C96,17,94.9,18.1,93.5,18.1',
  'M90.9,26.4h-34c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h34c1.3,0,2.4,1.1,2.4,2.4C93.3,25.3,92.3,26.4,90.9,26.4',
  'M88.3,34.6H59.6c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h28.7c1.3,0,2.4,1.1,2.4,2.4C90.7,33.5,89.6,34.6,88.3,34.6',
  'M85.7,42.9H50.3c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h35.4c1.3,0,2.4,1.1,2.4,2.4C88.1,41.8,87,42.9,85.7,42.9',
  'M83.1,51.1H50.5c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h32.6c1.3,0,2.4,1.1,2.4,2.4C85.5,50,84.4,51.1,83.1,51.1',
  'M80.5,59.4H67.6c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h12.8c1.3,0,2.4,1.1,2.4,2.4C82.9,58.3,81.8,59.4,80.5,59.4',
  'M77.8,67.6h-7.5c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h7.5c1.3,0,2.4,1.1,2.4,2.4C80.3,66.5,79.2,67.6,77.8,67.6',
  'M75.2,75.9H73c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4h2.2c1.3,0,2.4,1.1,2.4,2.4C77.6,74.8,76.6,75.9,75.2,75.9'
]
const stems = [
  'M39.1,75.9c-1.3,0-2.4-1.1-2.4-2.4v-66c0-1.3,1.1-2.4,2.4-2.4s2.4,1.1,2.4,2.4v66C41.5,74.8,40.4,75.9,39.1,75.9',
  'M30.8,75.9c-1.3,0-2.4-1.1-2.4-2.4v-66c0-1.3,1.1-2.4,2.4-2.4c1.3,0,2.4,1.1,2.4,2.4v66C33.3,74.8,32.2,75.9,30.8,75.9'
]
const swirls = [
  'M30.8,5c-1.3,0-2.4,1.1-2.4,2.4v50.7c-4.9-7-12.9-11.5-22-11.5C5.1,46.6,4,47.7,4,49c0,1.3,1.1,2.4,2.4,2.4c12.1,0,22,9.9,22,22v0c0,1.3,1.1,2.4,2.4,2.4c1.3,0,2.4-1.1,2.4-2.4v-66C33.3,6.1,32.2,5,30.8,5',
  'M22.6,75.9c-1.3,0-2.4-1.1-2.4-2.4c0-7.3-6.2-13.2-13.8-13.3C5,60.1,4,59,4,57.7c0-1.3,1-2.5,2.4-2.4c10.3,0.1,18.6,8.2,18.6,18.1C25.1,74.8,24,75.9,22.6,75.9'
]
</script>

<style lang="scss" scoped>
.v-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-02);
}

.v-loader__lockup {
  position: relative;
  display: inline-block;
}

.v-loader-fade-enter-active,
.v-loader-fade-leave-active {
  transition: opacity 0.25s ease;
}

.v-loader-fade-enter-from,
.v-loader-fade-leave-to {
  opacity: 0;
}

.v-loader__mark {
  display: block;
  width: 380px;
  height: auto;
  color: var(--color-brand-01);

  @media (max-width: $breakpoint-mobile) {
    width: 260px;
  }
}

// Positioned from the actual coordinates in LOGO-JAV_FOOTER.svg's own tiny
// wordmark paths, not eyeballed: all three lines (the "MUSIQUES"/"DES"/
// "L'École" paths) share the same right edge at x≈26 of the 102.5-wide
// viewBox, and the block starts at y≈6 of 80.9 tall — so right:74.6%
// (= (102.5-26)/102.5) and top:7.4% (= 6/80.9) put this text exactly where
// the original sits, instead of a left-anchored guess. Anchoring from the
// right (not left + flex-end) also means it stays correctly placed even
// though this substitute web font's own letter widths aren't identical to
// the original hand-drawn vector letterforms.
.v-loader__tagline {
  position: absolute;
  top: 7.4%;
  right: 74.6%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  @include type-label;
  // Deliberately smaller than type-label's own default — the space before
  // the stems/swirl start (where this text has to fit without overlapping
  // them, same as the real logo file) is narrow, and "MUSIQUES" was
  // otherwise running into the first vertical stem.
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: var(--color-brand-01);
  opacity: 0;
  animation: v-loader-tagline-in 0.5s ease both;
  // Lines up with when the slowest bar's own draw-in finishes (see the
  // bar/stem/swirl animation-delay values below), plus a short pause.
  animation-delay: 1.1s;

  @media (max-width: $breakpoint-mobile) {
    font-size: 9px;
  }
}

.v-loader__mark path {
  fill: currentColor;
  // fill-box: each bar/stem/swirl's own transform-origin percentage is
  // resolved against that single shape's bounding box, not the whole SVG's
  // viewBox — needed for every per-bar/per-stem anchor point below to
  // actually sit on that shape's own edge.
  transform-box: fill-box;
}

.v-loader__bar {
  // Anchored on each bar's own left edge — only the right end moves during
  // the vibrate loop, the left ends stay still. (Was centered — see git
  // history for that version, kept here as the option being compared.)
  transform-origin: 0% 50%;
  animation-name: v-loader-bar-draw, v-loader-bar-vibrate;
  animation-duration: 0.6s, 1.1s;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: both, none;
  // The vibrate loop's delay lines up exactly with when that same bar's own
  // draw-in finishes (its delay + its duration), so the handoff between the
  // two animations is seamless instead of snapping.
  animation-delay: calc(var(--i) * 0.05s), calc(var(--i) * 0.05s + 0.6s);
}

// Giving every bar the same 1.1s vibrate duration made them drift back into
// sync on a fixed, visible beat — all nine bowing together — which read as
// one travelling wave rather than independent vibration. Each bar instead
// gets its own, deliberately non-aligned vibrate duration (plus a slightly
// different depth) so they fall in and out of phase with each other
// continuously and never resettle into a repeating pattern. nth-child is
// safe here: the 9 bars are rendered first among this svg's children (see
// the template), so nth-child(1–9) lines up with them in order.
.v-loader__bar:nth-child(1) { animation-duration: 0.6s, 0.92s; }
.v-loader__bar:nth-child(2) { animation-duration: 0.6s, 1.31s; }
.v-loader__bar:nth-child(3) { animation-duration: 0.6s, 1.04s; }
.v-loader__bar:nth-child(4) { animation-duration: 0.6s, 1.47s; }
.v-loader__bar:nth-child(5) { animation-duration: 0.6s, 0.86s; }
.v-loader__bar:nth-child(6) { animation-duration: 0.6s, 1.22s; }
.v-loader__bar:nth-child(7) { animation-duration: 0.6s, 1.58s; }
.v-loader__bar:nth-child(8) { animation-duration: 0.6s, 0.99s; }
.v-loader__bar:nth-child(9) { animation-duration: 0.6s, 1.37s; }

// Simple fade — an earlier version grew each bar open from scaleX(0), but
// that read as more effort than wanted for just the entrance; the bars now
// only animate their shape (the vibrate loop below) once they're already
// visible.
@keyframes v-loader-bar-draw {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// A per-bar horizontal "squeeze" loop — every bar shrinks/grows on its own
// slightly offset timing (via the same --i stagger as the draw-in above),
// which is what actually reads as bars vibrating independently rather than
// one block breathing in and out together.
@keyframes v-loader-bar-vibrate {
  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(0.7);
  }
}

.v-loader__stem {
  transform-origin: 50% 100%;
  animation: v-loader-stem-draw 0.6s ease both;
  animation-delay: calc(0.1s + var(--i) * 0.08s);
}

@keyframes v-loader-stem-draw {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.v-loader__swirl {
  transform-origin: 50% 50%;
  animation: v-loader-swirl-draw 0.6s ease both;
  animation-delay: 0.2s;
}

@keyframes v-loader-swirl-draw {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes v-loader-tagline-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// Respect the OS-level reduced-motion setting — the loader still shows (it
// isn't purely decorative, it communicates that something is happening),
// just as a static mark instead of animated.
@media (prefers-reduced-motion: reduce) {
  .v-loader__bar,
  .v-loader__stem,
  .v-loader__swirl,
  .v-loader__tagline {
    animation: none;
    opacity: 1;
  }
}
</style>
