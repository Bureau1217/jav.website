import type { KqlBlock } from '~~/shared/types/kql'

/**
 * Blocks nested inside a structure field (array-layout columns,
 * section content) are stored double-encoded: the outer blocks field
 * is JSON, so a blocks field nested inside it stays a raw JSON
 * string instead of being decoded like the top-level one.
 */
export function parseKqlBlocks(raw: unknown): KqlBlock[] {
  if (Array.isArray(raw)) {
    return raw as KqlBlock[]
  }

  if (typeof raw !== 'string' || raw === '') {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
