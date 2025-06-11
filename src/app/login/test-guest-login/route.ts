// app/login/test-guest-login/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'libs/supabase/server'
import { randomUUID } from 'crypto'

export async function POST() {

  const supabase = await createClient()

  const randomId = randomUUID().slice(0, 8)
  const email = `guest_${randomId}@example.com`
  const password = randomId + "_guest"

  // ユーザー登録 & 自動ログイン
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError || !signUpData.user) {
    return NextResponse.redirect("/login?message=ゲストログイン失敗")
  }

  const userId = signUpData.user.id

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: userId, is_guest: true })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (profileError) {
    return NextResponse.redirect(`${baseUrl}/login?message=プロフィール作成失敗`);
  }

  return NextResponse.redirect("/")
}