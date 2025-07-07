// components/LogoutButton.tsx
'use client';

import { signOut } from 'app/login/actions';
import { client as supabase } from 'libs/supabase/client';
import logoutImg from '../../public/svg/logout.svg';
import loginImg from '../../public/svg/login.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'profileEnsuredForUser_';

export default function LogoutButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true
  let currentUserId: string | null = null

  const updateUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const newUserId = session?.user?.id ?? null

    if (mounted && currentUserId !== newUserId) {
      currentUserId = newUserId
      setUserId(newUserId)
    }
  }

  // 初回セッションチェック
  updateUser()

  // 🔁 1秒後に再取得（ログイン反映の遅延対策）
  const retry = setTimeout(() => {
    updateUser()
  }, 1000)

  // 🧭 認証状態変更を監視
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    const newUserId = session?.user?.id ?? null

    if (mounted && currentUserId !== newUserId) {
      currentUserId = newUserId
      setUserId(newUserId)
    }
  })

  return () => {
    mounted = false
    authListener.subscription?.unsubscribe()
    clearTimeout(retry)
  }
}, [])

  const handleLogout = async () => {
    if (userId) {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}${userId}`);
    }
    // 即時ログイン状態を反映（ログアウト画像へ切り替え）
    setUserId(null)
    await signOut(); // ログアウト処理
    // supabase.auth.getUser() を再実行して最新状態に同期
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
  };

  return (
    <button onClick={handleLogout} className="relative w-[35px] h-[35px] hover:opacity-80">
      <Image
        src={userId ? loginImg : logoutImg}
        alt="ログイン状況"
        fill
        sizes="10.3vw"
        style={{ objectFit: 'contain', objectPosition: '50% 50%' }}
      />
    </button>
  );
}