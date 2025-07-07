import { Page, expect } from '@playwright/test'
// tests/utils/test-user.ts
import {
  createTestUser,
  deleteTestUser,
  seedTestFoods,
  deleteFoodsByUserId,
  supabaseAdmin,
} from '../../utils/supabase-admin'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test001'

export async function setupTestUser() {
  await deleteTestUser(TEST_EMAIL)
  const result = await createTestUser(TEST_EMAIL, TEST_PASSWORD)

  if (!result || !result.user?.id) {
    throw new Error('テストユーザーの作成に失敗しました')
  }

  const userId = result.user.id

  await seedTestFoods(userId)

  const { data: seeded } = await supabaseAdmin
    .from('foods')
    .select('food_type, count')
    .eq('user_id', userId)

  if (!seeded || seeded.length === 0) {
    throw new Error('seedTestFoods がデータを挿入できていません')
  }

  console.log('🌱 seed後のfoods:', seeded)
  return userId
}

export async function cleanupTestUser(userId: string) {
  await deleteFoodsByUserId(userId)
  await deleteTestUser(TEST_EMAIL)

  const { data: after } = await supabaseAdmin
    .from('foods')
    .select()
    .eq('user_id', userId)

  console.log('🧹 削除後 foods:', after)
}

export const TEST_USER = {
  email: TEST_EMAIL,
  password: TEST_PASSWORD,
}

/**
 * Playwright用 login ユーティリティ（単体使用も可能）
 */
export async function loginAsTestUser(page: Page, email = TEST_EMAIL, password = TEST_PASSWORD) {
  await page.goto('/login')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL('/')
}