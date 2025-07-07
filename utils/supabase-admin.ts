// utils/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY! // 安全に.env.testだけで使用

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

export async function deleteTestUser(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error || !data || !data.users) {
    console.error("Error retrieving users:", error)
    return
  }

  const user = data.users.find((u) => u.email === email)
  if (user) {
    await supabaseAdmin.auth.admin.deleteUser(user.id)
  }
}

export async function createTestUser(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data?.user) {
    console.error('ユーザー作成に失敗:', error);
    return;
  }

  console.log('✔ 作成されたテストユーザーID:', data.user.id);

  /* 念のため email_confirm を強制
  await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
    email_confirm: true,
  });
*/
  return { user: data.user };
}

export async function seedTestFoods(userId: string, usedDate?: string) {
  const foods = [
    { user_id: userId, food_type: 'plant', count: 1, used_date: usedDate ?? null, is_placeholder: false },
    { user_id: userId, food_type: 'fruit', count: 1, used_date: null, is_placeholder: false },
    { user_id: userId, food_type: 'frog', count: 1, used_date: null, is_placeholder: false },
  ];

  const { error } = await supabaseAdmin.from('foods').insert(foods);

  if (error) {
    console.error('❌ seedTestFoods 失敗:', error.message);
    throw error;
  }

  console.log(`✅ ${foods.length} 件のテスト用 foods を作成しました`);
}

export async function deleteFoodsByUserId(userId: string) {
  const { error } = await supabaseAdmin
    .from('foods')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('❌ deleteFoods 失敗:', error.message);
    throw error;
  }

  console.log(`🧹 テスト用 foods を削除しました`);
}