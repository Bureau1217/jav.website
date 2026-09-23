// Strips HTML tags from a rich-text field (Kirby's Writer/description
// fields come through as HTML, e.g. "<p>...</p>") and truncates the plain
// text to a fixed character budget, appending a single "…" when cut short.
// Used to keep card-style previews (event cards, "Autres évènements") from
// overflowing when the editor writes a long description.
export function truncateText(html: string | null | undefined, maxLength = 185): string {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}
