import type { KqlFile } from '~~/shared/types/kql'

/**
 * Server-side counterpart of app/utils/resolveKqlFile.ts — structure/files
 * fields return raw filenames, not URLs, so we look the file up by name in
 * the page's resolved images/files collection. Duplicated here because
 * Nitro (server/) and the Vue app (app/) have separate auto-import scopes.
 */
export function resolveKqlFile(
  filenames: string[] | null | undefined,
  files: KqlFile[] | undefined
): KqlFile | null {
  if (!filenames?.length || !files?.length) {
    return null
  }

  return files.find(file => file.filename === filenames[0]) ?? null
}
