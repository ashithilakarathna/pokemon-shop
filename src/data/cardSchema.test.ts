import { describe, expect, it } from 'vitest'
import { CardSchema, safeParseCard } from './cardSchema'
import { CARDS } from './cards'

describe('CardSchema (positive)', () => {
  it('accepts minimal valid card', () => {
    const input = {
      id: 'base1-1',
      name: 'Alakazam',
      imageUrl: 'https://images.pokemontcg.io/base1/1.png',
    }
    const r = safeParseCard(input)
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.id).toBe('base1-1')
      expect(r.data.setName).toBeUndefined()
    }
  })

  it('accepts card with optional fields', () => {
    const input = {
      id: 'base1-1',
      name: 'Alakazam',
      imageUrl: 'https://images.pokemontcg.io/base1/1.png',
      setName: 'Base Set',
      rarity: 'Rare Holo',
    }
    expect(CardSchema.safeParse(input).success).toBe(true)
  })

  it('parses every static CARDS row', () => {
    expect(CARDS).toHaveLength(20)
    for (const row of CARDS) {
      const r = safeParseCard(row)
      expect(r.success, `expected CARDS row ${row.id} to satisfy CardSchema`).toBe(
        true,
      )
    }
  })
})

describe('CardSchema (negative)', () => {
  it('rejects empty object', () => {
    expect(safeParseCard({}).success).toBe(false)
  })

  it('rejects empty name', () => {
    const input = {
      id: 'x',
      name: '',
      imageUrl: 'https://example.com/a.png',
    }
    expect(safeParseCard(input).success).toBe(false)
  })

  it('rejects empty imageUrl', () => {
    const input = {
      id: 'x',
      name: 'Y',
      imageUrl: '',
    }
    expect(safeParseCard(input).success).toBe(false)
  })

  it('rejects non-url imageUrl', () => {
    expect(
      safeParseCard({
        id: 'x',
        name: 'Y',
        imageUrl: 'not-a-url',
      }).success,
    ).toBe(false)
  })
})
