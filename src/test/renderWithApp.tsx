import { render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

export type RenderWithAppOptions = {
  /** Initial history stack (last entry is the active location). */
  initialEntries?: string[]
}

/**
 * Renders the full app route tree inside {@link MemoryRouter}, matching
 * production usage in `src/main.tsx` (BrowserRouter + App).
 */
export function renderWithApp(
  options: RenderWithAppOptions = {},
): RenderResult {
  const { initialEntries = ['/'] } = options
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )
}
