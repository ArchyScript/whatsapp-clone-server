export interface PaginationQuery {
  cursor?: string
  limit?: number
  q?: string
}

export interface PaginatedResult<T> {
  items: T[]
  nextCursor: string | null
}
