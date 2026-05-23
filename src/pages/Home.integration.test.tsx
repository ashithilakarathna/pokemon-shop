import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithApp } from '../test/renderWithApp'

describe('Home gallery + pagination (integration)', () => {
  // Scenario: Empty or whitespace-only query keeps full catalog behavior
  // Given viewing the Home gallery with the static card catalog loaded
  // When no effective search text (default visit)
  // Then full unfiltered catalog with normal pagination on page 1
  it('shows ten card titles on page 1 and pagination status', () => {
    renderWithApp({ initialEntries: ['/'] })
    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles).toHaveLength(10)
    expect(titles[0]).toHaveTextContent('Alakazam')
    expect(titles[9]).toHaveTextContent('Mewtwo')

    const pagination = screen.getByRole('navigation', { name: /card pages/i })
    expect(pagination).toHaveTextContent(/Page 1 of 2/)
    expect(
      within(pagination).getByRole('button', { name: /previous page/i }),
    ).toBeDisabled()
    expect(
      within(pagination).getByRole('button', { name: /next page/i }),
    ).toBeEnabled()
  })

  // Baseline gallery pagination (requirement-gallery-search.md — unfiltered catalog)
  it('moves to page 2 on Next and disables Next on last page', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.click(
      screen.getByRole('button', { name: /next page/i }),
    )

    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles).toHaveLength(10)
    expect(titles[0]).toHaveTextContent('Nidoking')

    const pagination = screen.getByRole('navigation', { name: /card pages/i })
    expect(pagination).toHaveTextContent(/Page 2 of 2/)
    expect(
      within(pagination).getByRole('button', { name: /next page/i }),
    ).toBeDisabled()
    expect(
      within(pagination).getByRole('button', { name: /previous page/i }),
    ).toBeEnabled()
  })

  // Baseline gallery pagination (requirement-gallery-search.md — unfiltered catalog)
  it('returns to page 1 on Previous', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /previous page/i }))

    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles[0]).toHaveTextContent('Alakazam')
    const pagination = screen.getByRole('navigation', { name: /card pages/i })
    expect(pagination).toHaveTextContent(/Page 1 of 2/)
  })
})

describe('Home gallery search (integration)', () => {
  // Scenario: Search capability is accessible and understandable
  // Given assistive technology or keyboard navigation
  // When accessing the gallery search capability
  // Then accessible name and non-visual-only cues (hint text)
  it('exposes search with an accessible name and hint', () => {
    renderWithApp({ initialEntries: ['/'] })
    expect(
      screen.getByRole('searchbox', { name: /search cards/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/search by card name, set name, or rarity/i),
    ).toBeInTheDocument()
  })

  // Scenario Outline: Query matches supported card fields (example: zard → name substring)
  // Given Home gallery with static catalog loaded
  // When searching for "zard"
  // Then only cards with matching name substring are shown (case-insensitive)
  it('filters by name substring (zard → Charizard)', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.type(
      screen.getByRole('searchbox', { name: /search cards/i }),
      'zard',
    )
    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles).toHaveLength(1)
    expect(titles[0]).toHaveTextContent('Charizard')
  })

  // Scenario: Empty or whitespace-only query keeps full catalog behavior
  // Given Home gallery with static catalog loaded
  // When providing whitespace-only search text
  // Then full unfiltered catalog and pagination equivalent to unfiltered visit
  it('keeps full catalog for whitespace-only search', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.type(
      screen.getByRole('searchbox', { name: /search cards/i }),
      '   ',
    )
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(10)
    expect(
      screen.getByRole('navigation', { name: /card pages/i }),
    ).toHaveTextContent(/Page 1 of 2/)
  })

  // Scenario: No matching cards returns a clear empty result state
  // Given viewing the Home gallery
  // When searching with a query that matches no cards
  // Then clear no-results state and pagination does not imply additional pages
  it('shows empty state and hides pagination when nothing matches', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.type(
      screen.getByRole('searchbox', { name: /search cards/i }),
      'zzznomatchzzz',
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      /no cards match your search/i,
    )
    expect(
      screen.queryByRole('navigation', { name: /card pages/i }),
    ).not.toBeInTheDocument()
  })

  // Scenario: Query change resets pagination to maintain consistent browsing
  // Given result set spans multiple pages and not on page 1
  // When changing the search query
  // Then reset to page one and page count reflects filtered result set
  it('resets to page 1 when the search query changes', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.click(screen.getByRole('button', { name: /next page/i }))
    const pagination = screen.getByRole('navigation', { name: /card pages/i })
    expect(pagination).toHaveTextContent(/Page 2 of 2/)

    await user.type(
      screen.getByRole('searchbox', { name: /search cards/i }),
      'holo',
    )
    expect(pagination).toHaveTextContent(/Page 1 of/)
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeLessThanOrEqual(
      10,
    )
  })
})
