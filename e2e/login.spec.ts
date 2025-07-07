import { test, expect } from '@playwright/test'
import { deleteTestUser, createTestUser } from '../utils/supabase-admin'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test001'

test.describe('ログインページ', () => {

  test.beforeEach(async () => {
    await deleteTestUser(TEST_EMAIL)
    await createTestUser(TEST_EMAIL, TEST_PASSWORD)
  })

  test('未ログイン時はログインフォームが表示される', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/) // (/login/)の書き方でも良い
    await expect(page.getByRole('form', { name: /login/i })).toBeVisible()
  })

  test('EmailとPasswordでログインできる', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email address').fill('test@example.com')
    await page.getByLabel('Password').fill('test001')
    await page.getByRole('button', { name: 'Sign in', exact: true}).click()

    await expect(page).toHaveURL('/') // ログイン後のホームへ遷移
    await expect(page.getByAltText('鳥')).toBeVisible() // 鳥の画像が表示されるか
  })

  test('テストユーザー用ボタンでログインできる', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /体験する/ }).click()

    await expect(page).toHaveURL('/') // ホームへ遷移
    await expect(page.getByAltText('鳥')).toBeVisible() // 鳥の画像が表示されるか
  })
})

test.describe('新規登録とログインのテスト', () => {
  test.beforeEach(async () => {
    // 前回のテスト残骸を消す
    await deleteTestUser(TEST_EMAIL)
  })

  test.afterEach(async () => {
    // テスト後にユーザー削除
    await deleteTestUser(TEST_EMAIL)
  })

  test('新規ユーザー登録 → ログインできる', async ({ page }) => {
    await page.goto('/login')

    // メール & パスワードを入力して「新規ユーザー登録」
    await page.getByLabel('Email address').fill(TEST_EMAIL)
    await page.getByLabel('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: '新規ユーザー登録' }).click()

    // 登録後は login にリダイレクトされる
    await expect(page).toHaveURL('/login')

    // 再度ログイン
    await page.getByLabel('Email address').fill(TEST_EMAIL)
    await page.getByLabel('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()

    // ホーム画面へ遷移
    await expect(page).toHaveURL('/')
    await expect(page.getByAltText('鳥')).toBeVisible() // 鳥の画像が表示されるか
  })
})