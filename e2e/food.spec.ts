import { test, expect } from '@playwright/test'
import {
  deleteTestUser,
  createTestUser,
  seedTestFoods,
  deleteFoodsByUserId,
  supabaseAdmin,
} from '../utils/supabase-admin'
import { loginAsTestUser } from '../utils/test-helpers'
//import { format } from 'date-fns'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test001'

test.describe('FoodコンポーネントのE2Eテスト（UI操作に注目）', () => {
  let userId: string

  test.beforeAll(async () => {
    const now = new Date()

    // 明後日の日付オブジェクトを作成
    const dayAfterTomorrow = new Date(now)
    dayAfterTomorrow.setDate(now.getDate() + 2)

    // 表示用（例: '2025/07/06'）
    //const todayLabel = dayAfterTomorrow.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })

    // DB保存用（例: '2025-07-06'）
    const usedDate = dayAfterTomorrow.toISOString().split('T')[0]
    await deleteTestUser(TEST_EMAIL)
    const result = await createTestUser(TEST_EMAIL, TEST_PASSWORD)
    if (!result || !result.user?.id) throw new Error('テストユーザーの作成に失敗しました')
    userId = result.user.id

    await seedTestFoods(userId, usedDate)

    const { data: seeded } = await supabaseAdmin
      .from('foods')
      .select('food_type, count')
      .eq('user_id', userId)

    console.log('🌱 seed後のfoods:', seeded)
    if (!seeded || seeded.length === 0) {
      throw new Error('seedTestFoods がデータを挿入できていません')
    }
  })

  test.afterAll(async () => {
    await deleteFoodsByUserId(userId)
    await deleteTestUser(TEST_EMAIL)

    const { data } = await supabaseAdmin
      .from('foods')
      .select()
      .eq('user_id', userId)

    console.log('🧹 削除後 foods:', data)
  })

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, TEST_EMAIL, TEST_PASSWORD)
  })

  test('① 植物の画像をクリックしてダイアログが開き、閉じるボタンで閉じる', async ({ page }) => {
  await page.goto('/food')

  // 植物画像をクリック → ダイアログ表示
  await page.getByTestId('food-plant').click()
  await expect(page.getByRole('heading', { name: '植物' })).toBeVisible()

  // 閉じるボタンで閉じる
  await page.getByRole('button', { name: '閉じる' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  })
/*
  test('② フォーム送信でダイアログが閉じる（countの変化は検証しない）', async ({ page }) => {
    await page.goto('/food')

    await page.getByTestId('food-plant').click()
    await expect(page.getByRole('heading', { name: '植物' })).toBeVisible({ timeout: 10000 })

    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.check()

    await page.getByRole('button', { name: '設定する' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
*/
  test('③ weatherページに設定したfoodが表示される', async ({ page }) => {
    await page.goto('/weather')
    // 画像が表示されることだけ検証（used_date ありに seed 済み）
    await expect.poll(async () => {
      return await page.locator('img[alt="plant"]').count()
    }, { timeout: 10000 }).toBeGreaterThan(0)

   await page.screenshot({ path: 'weather-debug.png', fullPage: true })
  })
})