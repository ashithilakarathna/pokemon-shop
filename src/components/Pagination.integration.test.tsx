import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination (integration)', () => {
  it('calls onPrev and onNext when enabled', async () => {
    const user = userEvent.setup()
    const onPrev = vi.fn()
    const onNext = vi.fn()
    render(
      <Pagination page={2} totalPages={3} onPrev={onPrev} onNext={onNext} />,
    )
    await user.click(screen.getByRole('button', { name: /previous page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('does not call handlers when disabled', () => {
    const onPrev = vi.fn()
    const onNext = vi.fn()
    render(
      <Pagination page={1} totalPages={2} onPrev={onPrev} onNext={onNext} />,
    )
    const prev = screen.getByRole('button', { name: /previous page/i })
    expect(prev).toBeDisabled()
    expect(onPrev).not.toHaveBeenCalled()
  })
})
