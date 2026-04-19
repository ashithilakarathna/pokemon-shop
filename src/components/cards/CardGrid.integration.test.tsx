import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Card } from '../../data/types'
import { CardGrid } from './CardGrid'

const mockCards: Card[] = [
  {
    id: 'test-1',
    name: 'TestMon One',
    imageUrl: 'https://example.com/one.png',
  },
  {
    id: 'test-2',
    name: 'TestMon Two',
    imageUrl: 'https://example.com/two.png',
    setName: 'Test Set',
    rarity: 'Common',
  },
]

describe('CardGrid (integration)', () => {
  it('renders one article per card with accessible image alt', () => {
    render(<CardGrid cards={mockCards} />)
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(2)
    expect(
      screen.getByRole('img', { name: /TestMon One trading card/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /TestMon Two trading card/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'TestMon One' })).toBeInTheDocument()
    expect(screen.getByText(/Test Set · Common/)).toBeInTheDocument()
  })
})
