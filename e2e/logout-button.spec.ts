import { test, expect } from '@playwright/test'
import { createTestUser, deleteTestUser } from '../utils/supabase-admin'
import { loginAsTestUser } from '../utils/test-helpers'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test001'

test.describe('LogoutButton 表示と動作確認', () => {
  test.beforeEach(async () => {
    await deleteTestUser(TEST_EMAIL)
    await createTestUser(TEST_EMAIL, TEST_PASSWORD)
  })

  test('ログイン後は login.svg が表示され、ログアウト後に logout.svg に変わる', async ({ page }) => {
    // ログイン処理
    await loginAsTestUser(page, TEST_EMAIL, TEST_PASSWORD)

    // ログイン後の状態を確認（login.svg）
    const statusImage = page.locator('img[alt="ログイン"]')
    await expect(statusImage).toHaveAttribute('src', /login.*\.svg/, { timeout: 10000 })

    // ログアウト実行
    await statusImage.click()
    await page.waitForURL(/\/login/, { timeout: 10000 })

    // ホームに戻ってログアウト画像確認
    await page.goto('/')
    const logoutImage = page.locator('img[alt="ログアウト"]')
    await expect(logoutImage).toHaveAttribute('src', /logout.*\.svg/, { timeout: 10000 })
  })
})