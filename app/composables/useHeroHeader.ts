// DEPRECATED — unused. Initial approach for the homepage's transparent
// header: a child component (PagesDefault.vue) set this shared state to
// tell TheHeader.vue whether to go transparent. Doesn't work under SSR —
// Vue's server render is a single top-to-bottom pass, so a value set by a
// component further down the tree can't retroactively change an
// already-rendered ancestor/sibling (TheHeader renders before
// PagesDefault). Replaced with a direct route check in TheHeader.vue
// itself (`route.path === '/'`), which is known synchronously on both
// server and client. Kept only because this sandbox can't delete files —
// safe to delete by hand.
