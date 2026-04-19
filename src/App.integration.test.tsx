import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithApp } from './test/renderWithApp'

describe('App routing (integration)', () => {
  it('shows gallery on / with Gallery nav link active', () => {
    renderWithApp({ initialEntries: ['/'] })
    expect(
      screen.getByRole('heading', { name: /featured cards/i }),
    ).toBeInTheDocument()
    const gallery = screen.getByRole('link', { name: /^gallery$/i })
    expect(gallery).toHaveClass('site-nav__link--active')
  })

  it('navigates to About via header and shows About content', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/'] })
    await user.click(screen.getByRole('link', { name: /about us/i }))
    expect(
      screen.getByRole('heading', { name: /about us/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to the gallery/i }),
    ).toBeInTheDocument()
  })

  it('returns to gallery from About link', async () => {
    const user = userEvent.setup()
    renderWithApp({ initialEntries: ['/about'] })
    await user.click(screen.getByRole('link', { name: /back to the gallery/i }))
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /featured cards/i }),
      ).toBeInTheDocument()
    })
  })

  it('redirects unknown paths to home content', async () => {
    renderWithApp({ initialEntries: ['/this-route-does-not-exist'] })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /featured cards/i }),
      ).toBeInTheDocument()
    })
  })
})
