import { describe, expect, it } from 'vitest'
import type { Card } from '../data/types'
import { CARDS } from '../data/cards'
import {
  cardMatchesGallerySearch,
  filterCardsByGallerySearch,
  normalizeGallerySearchQuery,
} from './gallerySearch'
import { getPageSlice, getTotalPages, PAGE_SIZE } from './pagination'

const url = 'https://example.com/card.png'

function card(partial: Partial<Card> & Pick<Card, 'id' | 'name'>): Card {
  return {
    imageUrl: url,
    ...partial,
  }
}

describe('normalizeGallerySearchQuery', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeGallerySearchQuery('  mew')).toBe('mew')
    expect(normalizeGallerySearchQuery('base  ')).toBe('base')
  })
})

describe('filterCardsByGallerySearch — requirement: empty or whitespace-only query', () => {
  it('returns full catalog for empty string', () => {
    const out = filterCardsByGallerySearch(CARDS, '')
    expect(out).toHaveLength(CARDS.length)
    expect(out.map((c) => c.id)).toEqual(CARDS.map((c) => c.id))
  })

  it('returns full catalog for whitespace-only query', () => {
    const out = filterCardsByGallerySearch(CARDS, '   \t\n  ')
    expect(out).toHaveLength(CARDS.length)
  })

  it('returns a new array instance when unfiltered (callers may mutate safely)', () => {
    const out = filterCardsByGallerySearch(CARDS, '')
    expect(out).not.toBe(CARDS)
  })
})

describe('filterCardsByGallerySearch — requirement: case-insensitive substring on supported fields', () => {
  it('matches name substring (example: zard → Charizard)', () => {
    const out = filterCardsByGallerySearch(CARDS, 'zard')
    expect(out.map((c) => c.name)).toContain('Charizard')
    expect(out.every((c) => c.name.toLowerCase().includes('zard'))).toBe(true)
  })

  it('matches set name substring case-insensitively (example: BASE)', () => {
    const out = filterCardsByGallerySearch(CARDS, 'BASE')
    expect(out.length).toBe(CARDS.length)
    expect(out.every((c) => c.setName?.toLowerCase().includes('base'))).toBe(
      true,
    )
  })

  it('matches rarity substring (example: holo)', () => {
    const out = filterCardsByGallerySearch(CARDS, 'holo')
    expect(out.length).toBeGreaterThan(0)
    expect(
      out.every(
        (c) =>
          c.name.toLowerCase().includes('holo') ||
          c.setName?.toLowerCase().includes('holo') ||
          c.rarity?.toLowerCase().includes('holo'),
      ),
    ).toBe(true)
  })

  it('matches trimmed query against name (example: "  mew" → Mewtwo)', () => {
    const out = filterCardsByGallerySearch(CARDS, '  mew')
    expect(out.map((c) => c.name)).toContain('Mewtwo')
    expect(out.every((c) => cardMatchesGallerySearch(c, 'mew'))).toBe(true)
  })
})

describe('cardMatchesGallerySearch — requirement: missing optional fields', () => {
  const noOptionals: Card = card({
    id: 'x-1',
    name: 'UniqueNameOnly',
  })

  it('does not treat missing rarity as matching a rarity-only needle', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'holo')).toBe(false)
    expect(cardMatchesGallerySearch(noOptionals, 'rare')).toBe(false)
  })

  it('does not treat missing setName as matching a set-only needle', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'base set')).toBe(false)
  })

  it('still matches when a present field matches', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'unique')).toBe(true)
    expect(cardMatchesGallerySearch(noOptionals, 'NAME')).toBe(true)
  })

  it('mixed catalog: cards without optional fields are not false positives for optional-only text', () => {
    const catalog: Card[] = [
      card({
        id: 'a',
        name: 'Alpha',
      }),
      card({
        id: 'b',
        name: 'Beta',
        setName: 'Promo Pack',
        rarity: 'Common',
      }),
    ]
    const out = filterCardsByGallerySearch(catalog, 'promo')
    expect(out.map((c) => c.id)).toEqual(['b'])
  })
})

describe('filterCardsByGallerySearch — requirement: no matching cards', () => {
  it('returns empty array when nothing matches', () => {
    expect(filterCardsByGallerySearch(CARDS, 'zzznomatchzzz')).toEqual([])
  })

  it('implies a single logical page for pagination helpers (zero results)', () => {
    const filtered = filterCardsByGallerySearch(CARDS, 'zzznomatchzzz')
    expect(getTotalPages(filtered.length, PAGE_SIZE)).toBe(1)
    expect(getPageSlice(filtered, 1, PAGE_SIZE)).toEqual([])
  })
})

describe('filterCardsByGallerySearch + pagination — requirement: filtered page count', () => {
  it('page count reflects only the filtered result set', () => {
    const filtered = filterCardsByGallerySearch(CARDS, 'Rare Holo')
    const pages = getTotalPages(filtered.length, PAGE_SIZE)
    expect(filtered.length).toBeLessThan(CARDS.length)
    expect(pages).toBe(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  })
})
