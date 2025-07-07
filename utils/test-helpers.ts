// tests/utils/test-helpers.ts
import { expect, Page } from '@playwright/test'

export async function loginAsTestUser(page: Page, email = 'test@example.com', password = 'test001') {
  await page.goto('/login')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/')
}