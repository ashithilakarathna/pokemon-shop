import { test, expect } from '@playwright/test'
import {
  givenUserIsOnGalleryHome,
  paginationNav,
} from './support/bdd'

test.describe('Feature: Pagination', () => {
  test('Scenario: visitor moves between pages and controls disable correctly', async ({
    page,
  }) => {
    await givenUserIsOnGalleryHome(page)

    const pagination = paginationNav(page)
    await expect(pagination).toContainText(/Page 1 of 2/)

    const next = pagination.getByRole('button', { name: /next page/i })
    const prev = pagination.getByRole('button', { name: /previous page/i })

    await expect(prev).toBeDisabled()
    await expect(next).toBeEnabled()

    await next.click()

    await expect(pagination).toContainText(/Page 2 of 2/)
    await expect(page.getByRole('heading', { name: 'Nidoking' })).toBeVisible()
    await expect(next).toBeDisabled()
    await expect(prev).toBeEnabled()

    await prev.click()

    await expect(pagination).toContainText(/Page 1 of 2/)
    await expect(page.getByRole('heading', { name: 'Alakazam' })).toBeVisible()
    await expect(prev).toBeDisabled()
    await expect(next).toBeEnabled()
  })
})
