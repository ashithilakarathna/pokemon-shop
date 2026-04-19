import { describe, expect, it } from 'vitest'
import { getPageSlice, getTotalPages, PAGE_SIZE } from './pagination'
import type { Card } from '../data/types'

const card = (i: number): Card => ({
  id: `id-${i}`,
  name: `Name ${i}`,
  imageUrl: 'https://example.com/card.png',
})

const ten: Card[] = Array.from({ length: 10 }, (_, i) => card(i))
const twenty: Card[] = Array.from({ length: 20 }, (_, i) => card(i))

describe('getTotalPages', () => {
  it('returns 1 for zero items (spec: Math.max(1, ceil(0)))', () => {
    expect(getTotalPages(0, 10)).toBe(1)
  })

  it('returns 2 for twenty items and page size 10', () => {
    expect(getTotalPages(20, 10)).toBe(2)
  })

  it('returns 3 for twenty-one items and page size 10', () => {
    expect(getTotalPages(21, 10)).toBe(3)
  })

  it('returns 1 for a single item and page size 10', () => {
    expect(getTotalPages(1, 10)).toBe(1)
  })

  it('uses positive page size', () => {
    expect(getTotalPages(100, PAGE_SIZE)).toBe(10)
  })
})

describe('getPageSlice', () => {
  it('returns first ten cards for page 1', () => {
    const slice = getPageSlice(twenty, 1, 10)
    expect(slice).toHaveLength(10)
    expect(slice[0].id).toBe('id-0')
    expect(slice[9].id).toBe('id-9')
  })

  it('returns second ten cards for page 2', () => {
    const slice = getPageSlice(twenty, 2, 10)
    expect(slice).toHaveLength(10)
    expect(slice[0].id).toBe('id-10')
    expect(slice[9].id).toBe('id-19')
  })

  it('clamps page <= 0 to page 1', () => {
    expect(getPageSlice(twenty, 0, 10)[0].id).toBe('id-0')
    expect(getPageSlice(twenty, -3, 10)[0].id).toBe('id-0')
  })

  it('clamps page beyond total to last page', () => {
    const last = getPageSlice(twenty, 99, 10)
    expect(last).toHaveLength(10)
    expect(last[0].id).toBe('id-10')
  })

  it('returns empty array for empty items', () => {
    expect(getPageSlice([], 1, 10)).toEqual([])
  })

  it('returns full single page when fewer items than page size', () => {
    const three = [card(0), card(1), card(2)]
    const slice = getPageSlice(three, 1, 10)
    expect(slice).toHaveLength(3)
  })

  it('matches unit skill example: high page clamps to last slice', () => {
    const all = [...ten, ...ten]
    const last = getPageSlice(all, 99, 10)
    expect(last).toHaveLength(10)
    // Second page is the duplicate half: ids id-0 … id-9 again (not id-10).
    expect(last[0].id).toBe('id-0')
    expect(last[9].id).toBe('id-9')
  })
})
