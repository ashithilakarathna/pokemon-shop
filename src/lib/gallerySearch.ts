import type { Card } from '../data/types'

/** Leading/trailing whitespace is ignored; empty after trim means no effective search. */
export function normalizeGallerySearchQuery(raw: string): string {
  return raw.trim()
}

function fieldIncludes(field: string | undefined, needleLower: string): boolean {
  if (field === undefined) return false
  return field.toLowerCase().includes(needleLower)
}

/** Case-insensitive substring match on present fields only: name, optional setName, optional rarity. */
export function cardMatchesGallerySearch(card: Card, rawQuery: string): boolean {
  const q = normalizeGallerySearchQuery(rawQuery)
  if (q === '') return true
  const needle = q.toLowerCase()
  return (
    fieldIncludes(card.name, needle) ||
    fieldIncludes(card.setName, needle) ||
    fieldIncludes(card.rarity, needle)
  )
}

/** Empty or whitespace-only query returns a shallow copy of the full catalog (unfiltered). */
export function filterCardsByGallerySearch(
  cards: readonly Card[],
  rawQuery: string,
): Card[] {
  if (normalizeGallerySearchQuery(rawQuery) === '') {
    return cards.slice()
  }
  return cards.filter((card) => cardMatchesGallerySearch(card, rawQuery))
}
