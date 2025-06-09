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
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
    // auth 状態変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      authListener.subscription?.unsubscribe(); // クリーンアップ
    };
  }, []);

  const handleLogout = async () => {
    if (userId) {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}${userId}`);
    }
    await signOut(); // Server Action 実行 → /login に遷移
  };

  return (
    <button onClick={handleLogout} className="relative w-[35px] h-[35px] hover:opacity-80">
      <Image
        src={userId ? loginImg : logoutImg}
        alt="ログイン状況"
        fill
        sizes="10.3vw"
        style={{ objectFit: 'contain', objectPosition: '50% 50%' }}
        priority
      />
    </button>
  );
}