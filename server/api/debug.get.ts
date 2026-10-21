// DEPRECATED — temporary debug endpoint, no longer needed. Kept as a
// harmless no-op (an empty file would break Nitro's route registration)
// because this sandbox can't delete files — safe to delete this file by
// hand.
export default defineEventHandler(() => ({ deprecated: true }))
