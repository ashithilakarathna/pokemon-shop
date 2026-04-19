import { expect, type Locator, type Page } from '@playwright/test'

/** Opens the gallery home route (uses `baseURL` from playwright.config). */
export async function givenUserIsOnGalleryHome(page: Page) {
  await page.goto('/')
}

export function mainNav(page: Page) {
  return page.getByRole('navigation', { name: /main/i })
}

/** Pagination region (see app `Pagination` component: `aria-label="Card pages"`). */
export function paginationNav(page: Page): Locator {
  return page.getByRole('navigation', { name: /card pages/i })
}

export async function thenFeaturedGalleryHeadingVisible(page: Page) {
  await expect(
    page.getByRole('heading', { name: /featured cards/i }),
  ).toBeVisible()
}
