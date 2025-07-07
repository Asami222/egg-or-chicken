'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from 'libs/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { getURL } from 'libs/helpers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 先に既存セッションを破棄しておく
  //await supabase.auth.signOut();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  // 先に既存セッションを破棄しておく
  //await supabase.auth.signOut();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Error signing up')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login')
}
/*
async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}
*/

export async function oAuthSignIn(provider: Provider) {
  if (!provider) {
      return redirect('/login?message=No provider selected')
  }

  const supabase = await createClient();
  // 先に既存セッションを破棄しておく
  //await supabase.auth.signOut();
  const redirectUrl = getURL("/auth/callback")
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
          redirectTo: redirectUrl,
      }
  })

  if (error) {
      redirect('/login?message=Could not authenticate user')
  }

  return redirect(data.url)
}

export async function testLogin() {
  const supabase = await createClient();

  const data = {
    email: "asami2.works@gmail.com",
    password: "test001",
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/login?message=Could not authenticate test user');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
