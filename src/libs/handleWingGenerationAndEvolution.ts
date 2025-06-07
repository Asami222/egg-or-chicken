import { client as supabase } from 'libs/supabase/client';
import { Wing,Food } from 'utils/types';

export async function handleWingGenerationAndEvolution(
  userId: string,
  todayStr: string,
  isPastNine: boolean,
  foods: Food[]
): Promise<{ wing: Wing | null; wings: Wing[] }> {
  const shouldSkipWing = foods.some(
    f => f.used_date === todayStr && (f.food_type === 'plant' || f.food_type === 'frog')
  );
  const isFrog = foods.some(f => f.food_type === 'frog');

  let wing: Wing | null = null;
  // 🪶 通常の羽生成（9時以降、frog/plantがないとき） 
  if (isPastNine && !shouldSkipWing) {
    const { data: existingWing } = await supabase
      .from('wings')
      .select('date')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .maybeSingle();

    if (!existingWing) {
      const selectedWing =
        Math.random() < 0.5
          ? '/obtain/wing-tate.webp'
          : '/obtain/wing-yoko.webp';

      const insertResult = await supabase
        .from('wings')
        .insert([{ user_id: userId, date: todayStr, wing_image: selectedWing }])
        .select('id,user_id, date, wing_image, is_placeholder')
        .single();

      if (insertResult.error) {
        console.error("翼のINSERTに失敗:", insertResult.error);
      }
      wing = insertResult.data ?? null;
    }
  }

  // 🐸 frogが含まれていた場合は最大3枚羽削除
  if (isFrog) {
    const { data: existingWings, error } = await supabase
      .from('wings')
      .select('id')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    const wingsToDelete = existingWings.slice(0, Math.min(3, existingWings.length));
    for (const wing of wingsToDelete) {
      await supabase.from('wings').delete().eq('id', wing.id);
    }
  }

  const { data: allWings, error: getError } = await supabase
    .from('wings')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (getError) {
    console.error("羽根の取得に失敗:", getError);
  }

  if (allWings && allWings.length >= 10) {
    const hasChicken = allWings.some(w => w.wing_image === '/chicken.webp');
    const wingIdsToDelete = allWings
      .filter(w => w.wing_image.startsWith('/obtain/wing'))
      .slice(0, 10);

    if (wingIdsToDelete.length === 10) {
      const deleteResult = await supabase
        .from('wings')
        .delete()
        .in('id', wingIdsToDelete.map(w => w.id));

      if (deleteResult.error) {
        console.error("10枚の羽根削除に失敗:", deleteResult.error);
      }

      if (!hasChicken) {
        const insertResult = await supabase
          .from('wings')
          .insert([{ user_id: userId, date: todayStr, wing_image: '/chicken.webp' }])
          .single();

        if (insertResult.error) {
          console.error("チキンの挿入に失敗:", insertResult.error);
        }
      }

      const { data: updatedWings, error: refetchError } = await supabase
        .from('wings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (refetchError) {
        console.error("羽根再取得失敗:", refetchError);
      }

      return {
        wing,
        wings: updatedWings ?? [],
      };
    }
  }

  return {
    wing,
    wings: allWings ?? [],
  };
}