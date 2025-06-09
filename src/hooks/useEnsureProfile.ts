// libs/hooks/useEnsureProfile.ts
import { useEffect, useState } from "react";
import { client as supabase } from "libs/supabase/client";
import { ensureProfileExists } from "libs/userPlace";

const LOCAL_STORAGE_KEY = "profileEnsuredForUser_";

export const useEnsureProfile = () => {
  const [hasEnsured, setHasEnsured] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        console.log("セッションがありません。プロフィール確認をスキップします。");
        return;
      }

      const storageKey = `${LOCAL_STORAGE_KEY}${user.id}`;
      const alreadyEnsured = localStorage.getItem(storageKey);
      if (alreadyEnsured) {
        console.log("プロフィールはすでに確認済みです。");
        return;
      }

      try {
        await ensureProfileExists();
        localStorage.setItem(storageKey, "true");
        setHasEnsured(true);
        console.log("プロフィール作成完了");
      } catch (err) {
        console.error("プロフィール作成時エラー", err);
      }
    };

    if (!hasEnsured) {
      init();
    }
  }, [hasEnsured]);
};