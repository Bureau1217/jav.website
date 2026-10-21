// Smooth height/opacity open and close for anything toggled with v-show (or
// v-if) — used as JS hooks on a <Transition :css="false">, e.g.
//
//   <Transition :css="false" @enter="collapseEnter" @leave="collapseLeave">
//     <div v-show="isOpen">…</div>
//   </Transition>
//
// A plain v-show flips display:none instantly, so there's nothing for CSS to
// animate; these hooks animate the element's own height (plus its vertical
// padding and opacity) with the Web Animations API instead, and tell Vue when
// they're done so it can then hide/remove it for real. Visitors who prefer
// reduced motion get the instant toggle.
const DURATION = 350
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function collapse(el: Element, from: 'collapsed' | 'expanded', done: () => void) {
  const target = el as HTMLElement
  if (prefersReducedMotion()) {
    done()
    return
  }

  target.getAnimations().forEach(animation => animation.cancel())

  // offsetHeight is the border-box height, so the box-sizing has to match
  // while it's animated or the final frame wouldn't line up with the real
  // layout.
  target.style.boxSizing = 'border-box'
  const { paddingTop, paddingBottom } = getComputedStyle(target)
  const expanded = {
    height: `${target.offsetHeight}px`,
    paddingTop,
    paddingBottom,
    opacity: 1
  }
  const collapsed = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 }

  target.style.overflow = 'hidden'
  const animation = target.animate(
    from === 'collapsed' ? [collapsed, expanded] : [expanded, collapsed],
    { duration: DURATION, easing: EASING }
  )

  const cleanup = () => {
    target.style.overflow = ''
    target.style.boxSizing = ''
    done()
  }
  animation.onfinish = cleanup
  animation.oncancel = cleanup
}

export function collapseEnter(el: Element, done: () => void) {
  collapse(el, 'collapsed', done)
}

export function collapseLeave(el: Element, done: () => void) {
  collapse(el, 'expanded', done)
}
