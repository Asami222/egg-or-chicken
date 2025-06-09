
import { client as supabase } from 'libs/supabase/client';

export const ensureProfileExists = async () => {

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
console.log("user id:", user?.id);
  if (authError) {
    console.error("Auth error:", authError.message);
    return;
  }
 if (!user) {
    console.log("No user logged in.");
    return;
  }


  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        location: "", // 空文字でもOK、後で更新可能
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Upsert error:", error.message);
  } else {
    console.log("Upsert success:", data);
  }
};

export const getUserPlace = async () => {

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('location')
    .eq('user_id', user.id)
    .maybeSingle(); // <= 0件でもエラーにならない

  return error ? null : data?.location;
};

export const saveUserPlace = async (newLocation: string) => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth error:", authError.message);
    return;
  }
  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        location: newLocation
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Save place upsert error:", error.message);
  } else {
    console.log("Place saved:", data);
  }
};