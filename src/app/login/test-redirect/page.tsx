// app/login/test-redirect/page.tsx
'use client'

import { useEffect } from 'react'

export default function TestRedirectPage() {
  useEffect(() => {
    // ✅ Homeに遷移 & 強制リロード
    window.location.replace('/');
  }, []);

  return (
    <p className="text-center mt-8 text-sm text-gray-500">
      ログイン中です。少々お待ちください...
    </p>
  );
}