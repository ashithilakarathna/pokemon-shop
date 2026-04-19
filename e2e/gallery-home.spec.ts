import { test, expect } from '@playwright/test'
import {
  givenUserIsOnGalleryHome,
  thenFeaturedGalleryHeadingVisible,
} from './support/bdd'

test.describe('Feature: Gallery home', () => {
  test('Scenario: visitor sees the featured gallery', async ({ page }) => {
    await givenUserIsOnGalleryHome(page)
    await thenFeaturedGalleryHeadingVisible(page)

    // First card is an article with an h2 title (stable without loading remote image bytes).
    await expect(page.getByRole('article').first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  })
})
