export const getPaginationLimit = (limit?: number, fallback = 25, max = 100) =>
  Math.min(Math.max(limit ?? fallback, 1), max)
