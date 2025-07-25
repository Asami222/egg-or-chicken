
import { login, signup, testLogin } from "./actions";
import { OAuthButtons } from "./oauth-signin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "libs/supabase/server";
import Separator from "components/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン | Egg or Chicken",
  description: "ログインページです。メールとパスワード入力、GitHub、テストユーザーでログインのどれかを選びログインできます。新規登録の場合は、メールとパスワードを入力後に新規ユーザー登録をクリックしてください。"
}


export default async function LoginPage() {
 const headersList = await headers();
  const fullUrl = headersList.get("x-url") || "";
  const url = new URL(fullUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
  const message = url.searchParams.get("message") ?? "";
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <section className="mt-8">
        <OAuthButtons />
        <Separator>or continue with</Separator>
        <form id="login-form" aria-label="login">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
              <input id="email" name="email" type="email" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="m@example.com" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input id="password" name="password" type="password" minLength={6} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
            </div> 
          {message && (
              <div className="text-sm font-medium text-destructive">
                {message}
              </div>
          )}
          <button formAction={login} className="inline-block w-full text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign in</button>
          <button formAction={signup} className="block mx-auto text-teal-500 hover:text-teal-600 font-medium text-[13px] px-5 py-2.5">新規ユーザー登録</button>
          </form>
          {/* テストユーザーログイン */}
          <form action="" method="POST">
            <button
              formAction={testLogin}
              className="mt-2 w-full text-center text-sm text-sky-600 underline"
            >
              テストユーザーでログイン
            </button>
          </form>
          {/* 体験ログイン（ゲストアカウント自動生成） */}
          <form action="/login/test-guest-login" method="POST">
            <button type="submit" className="mt-4 w-full text-center text-sm text-teal-600 underline">
              テストユーザーとして体験する（登録不要）
            </button>
          </form>
    </section>
  )
}

