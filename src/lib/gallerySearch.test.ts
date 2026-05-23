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
  // Scenario Outline: Query matches supported card fields
  // Matching ignores leading or trailing query whitespace (example: "  mew")
  it('trims leading and trailing whitespace', () => {
    expect(normalizeGallerySearchQuery('  mew')).toBe('mew')
    expect(normalizeGallerySearchQuery('base  ')).toBe('base')
  })
})

describe('filterCardsByGallerySearch — requirement: empty or whitespace-only query', () => {
  // Scenario: Empty or whitespace-only query keeps full catalog behavior
  // Given static card catalog
  // When providing no effective search text (empty string)
  // Then full unfiltered catalog is returned
  it('returns full catalog for empty string', () => {
    const out = filterCardsByGallerySearch(CARDS, '')
    expect(out).toHaveLength(CARDS.length)
    expect(out.map((c) => c.id)).toEqual(CARDS.map((c) => c.id))
  })

  // Scenario: Empty or whitespace-only query keeps full catalog behavior
  // Given static card catalog
  // When providing whitespace-only search text
  // Then full unfiltered catalog is returned
  it('returns full catalog for whitespace-only query', () => {
    const out = filterCardsByGallerySearch(CARDS, '   \t\n  ')
    expect(out).toHaveLength(CARDS.length)
  })

  // Scenario: Empty or whitespace-only query keeps full catalog behavior
  // Implementation: unfiltered path returns a copy so callers cannot mutate CARDS
  it('returns a new array instance when unfiltered (callers may mutate safely)', () => {
    const out = filterCardsByGallerySearch(CARDS, '')
    expect(out).not.toBe(CARDS)
  })
})

describe('filterCardsByGallerySearch — requirement: case-insensitive substring on supported fields', () => {
  // Scenario Outline example: zard → a name substring
  // Given static catalog loaded
  // When searching for "zard"
  // Then only cards with matching name substring are returned (case-insensitive)
  it('matches name substring (example: zard → Charizard)', () => {
    const out = filterCardsByGallerySearch(CARDS, 'zard')
    expect(out.map((c) => c.name)).toContain('Charizard')
    expect(out.every((c) => c.name.toLowerCase().includes('zard'))).toBe(true)
  })

  // Scenario Outline example: BASE → a set name substring
  // Given static catalog loaded
  // When searching for "BASE"
  // Then only cards with matching setName substring are returned (case-insensitive)
  it('matches set name substring case-insensitively (example: BASE)', () => {
    const out = filterCardsByGallerySearch(CARDS, 'BASE')
    expect(out.length).toBe(CARDS.length)
    expect(out.every((c) => c.setName?.toLowerCase().includes('base'))).toBe(
      true,
    )
  })

  // Scenario Outline example: holo → a rarity substring
  // Given static catalog loaded
  // When searching for "holo"
  // Then only cards with matching rarity substring are returned (case-insensitive)
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

  // Scenario Outline example: "  mew" → a trimmed name substring
  // Given static catalog loaded
  // When searching with leading whitespace
  // Then trim is applied and name substring match applies (case-insensitive)
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

  // Scenario: Missing optional fields do not create false-positive matches
  // Given a card with optional rarity missing
  // When searching for text that would only match rarity
  // Then the card is not returned based on missing data
  it('does not treat missing rarity as matching a rarity-only needle', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'holo')).toBe(false)
    expect(cardMatchesGallerySearch(noOptionals, 'rare')).toBe(false)
  })

  // Scenario: Missing optional fields do not create false-positive matches
  // Given a card with optional setName missing
  // When searching for text that would only match setName
  // Then the card is not returned based on missing data
  it('does not treat missing setName as matching a set-only needle', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'base set')).toBe(false)
  })

  // Scenario: Missing optional fields do not create false-positive matches
  // Given a card with optional fields missing
  // When searching for text that matches a present field (name)
  // Then the card can still match through fields that are present
  it('still matches when a present field matches', () => {
    expect(cardMatchesGallerySearch(noOptionals, 'unique')).toBe(true)
    expect(cardMatchesGallerySearch(noOptionals, 'NAME')).toBe(true)
  })

  // Scenario: Missing optional fields do not create false-positive matches
  // Given a mixed catalog with and without optional fields
  // When searching for optional-field-only text
  // Then cards without that field are excluded; cards with the field may match
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
  // Scenario: No matching cards returns a clear empty result state
  // Given static catalog
  // When searching with a query that matches no cards
  // Then an empty result set is returned
  it('returns empty array when nothing matches', () => {
    expect(filterCardsByGallerySearch(CARDS, 'zzznomatchzzz')).toEqual([])
  })

  // Scenario: No matching cards returns a clear empty result state
  // Pagination does not imply additional result pages (zero items → one page, empty slice)
  it('implies a single logical page for pagination helpers (zero results)', () => {
    const filtered = filterCardsByGallerySearch(CARDS, 'zzznomatchzzz')
    expect(getTotalPages(filtered.length, PAGE_SIZE)).toBe(1)
    expect(getPageSlice(filtered, 1, PAGE_SIZE)).toEqual([])
  })
})

describe('filterCardsByGallerySearch + pagination — requirement: filtered page count', () => {
  // Scenario: Query change resets pagination to maintain consistent browsing
  // Page count reflects only the filtered result set (unit-level pagination math)
  it('page count reflects only the filtered result set', () => {
    const filtered = filterCardsByGallerySearch(CARDS, 'Rare Holo')
    const pages = getTotalPages(filtered.length, PAGE_SIZE)
    expect(filtered.length).toBeLessThan(CARDS.length)
    expect(pages).toBe(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  })
})
