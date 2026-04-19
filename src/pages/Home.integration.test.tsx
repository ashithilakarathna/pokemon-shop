import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithApp } from '../test/renderWithApp'

describe('Home gallery + pagination (integration)', () => {
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
