import { test, expect } from '@playwright/test'
import {
  givenUserIsOnGalleryHome,
  mainNav,
  thenFeaturedGalleryHeadingVisible,
} from './support/bdd'

test.describe('Feature: About', () => {
  test('Scenario: visitor opens About from the header and returns to the gallery', async ({
    page,
  }) => {
    await givenUserIsOnGalleryHome(page)

    // Scope to main nav to avoid matching unrelated links if the route tree adds more.
    await mainNav(page).getByRole('link', { name: /about us/i }).click()

    await expect(
      page.getByRole('heading', { name: /about us/i }),
    ).toBeVisible()

    await page.getByRole('link', { name: /back to the gallery/i }).click()

    await thenFeaturedGalleryHeadingVisible(page)
  })

  test('Scenario: deep link and browser history', async ({ page }) => {
    // Seed history: SPA has no "previous" page after a lone goto('/about'), so goBack()
    // would leave the app. Visit home first, then deep-link to About.
    await page.goto('/')
    await thenFeaturedGalleryHeadingVisible(page)

    await page.goto('/about')

    await expect(
      page.getByRole('heading', { name: /about us/i }),
    ).toBeVisible()

    await page.goBack()

    await thenFeaturedGalleryHeadingVisible(page)
  })
})
