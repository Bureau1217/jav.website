import type { KqlFile } from '~~/shared/types/kql'

/**
 * Structure/files fields store raw filenames, not URLs. This looks
 * up the resolved file (with its URL) from the page's images/files
 * collection by filename.
 */
export function resolveKqlFile(
  filenames: string[] | undefined,
  files: KqlFile[] | undefined
): KqlFile | null {
  if (!filenames?.length || !files?.length) {
    return null
  }

  return files.find(file => file.filename === filenames[0]) ?? null
}
