import type { Card } from '../data/types'

export const PAGE_SIZE = 10

export function getTotalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize))
}

export function getPageSlice(
  items: Card[],
  page: number,
  pageSize: number,
): Card[] {
  const safePage = Math.min(
    Math.max(1, page),
    getTotalPages(items.length, pageSize),
  )
  const start = (safePage - 1) * pageSize
  return items.slice(start, start + pageSize)
}
