import { client as supabase } from 'libs/supabase/client';
//import { getMissingDatesWithBlackEggs } from './blackEggsHelper';
import { generateEggsFromWeather, generateFoodsFromWeather } from './generateFromWeather';
import { incrementItemCount } from 'utils/incrementItemCount';
import { WeatherData1 } from 'utils/weatherdata';
import { Egg, Wing, Food } from 'utils/types';

//保存・更新処理

export async function generateAndStoreEggsAndWing(
  weatherData: (WeatherData1 | undefined)[],
  userId: string
): Promise<{ eggs: Egg[]; wing: Wing | null }> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());// 00:00の今日
  const todayStr = today.toISOString().split('T')[0];
  const isPastNine = now.getHours() >= 9;

  // --- 卵処理 ---
  const { data: existingEggs } = await supabase
    .from('eggs')
    .select('date, egg_color')
    .eq('user_id', userId);

  const existingMap = new Map<string, string>(
    (existingEggs ?? []).map((egg) => [egg.date, egg.egg_color])
  );

  {/*// 黒卵補完
  const missingDates = getMissingDatesWithBlackEggs(existingDates, today);
  for (const dateStr of missingDates) {
    await (await supabase).from('eggs').insert({
      user_id: userId,
      date: dateStr,
      weather: 'unknown',
      egg_color: '/eggs/egg_black.jpg',
      is_placeholder: true,
    });
  }
  */}
  // 新しい卵を生成
  const newEggs = generateEggsFromWeather(weatherData);
  const inserts: any[] = [];
  const updates: { egg: Egg }[] = [];

  for (const egg of  newEggs) {
    const eggDate = new Date(`${egg.date}T09:00:00+09:00`);
    const isToday = egg.date === todayStr
    const isFuture = new Date(egg.date) > today;
    const isPastNine = now > eggDate;

    const alreadyExists = existingMap.has(egg.date);

    if (!alreadyExists) {
     inserts.push({
        user_id: userId,
        date: egg.date,
        weather: egg.weather,
        egg_color: egg.egg_color,
        is_placeholder: egg.is_placeholder,
      });
    } else if ((isToday && !isPastNine) || isFuture) {
      // 今日の朝9時前 or 未来の日付なら更新
      updates.push({ egg });
    } 
  }

  // 一括挿入
  if (inserts.length > 0) {
    await supabase.from('eggs').insert(inserts);
  }

  // 一括更新（バルクアップデートが Supabase で非対応なため、ここはループだが少数）
  for (const { egg } of updates) {
    await supabase
      .from('eggs')
      .update({
        weather: egg.weather,
        egg_color: egg.egg_color,
        is_placeholder: egg.is_placeholder,
      })
      .eq('user_id', userId)
      .eq('date', egg.date);
  }

  // 卵データを再取得
  const { data: finalEggs } = await supabase
    .from('eggs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

    // --- 翼処理 ---
  let wing: Wing | null = null;

  if (isPastNine) {
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
        .insert([
          {
            user_id: userId,
            date: todayStr,
            image_url: selectedWing,
          },
        ])
        .select()
        .single();

      wing = insertResult.data ?? null;
    }
  }

  return { eggs: finalEggs as Egg[], wing };
}


export async function generateAndStoreFoods(
  weatherData: (WeatherData1 | undefined)[],
  userId: string
): Promise<Food[]> {
  
  const foods = generateFoodsFromWeather(weatherData);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const inserts = foods.filter(
    (food) =>
      food.date === today && now.getHours() >= 9 // 9時以降のみ保存
  );

  for (const food of inserts) {
    await supabase
      .from('foods')
      .upsert(
        {
          ...food,
          user_id: userId,
          count: undefined, // countは使わずに increment へ
        },
        {
          onConflict: 'user_id,date,food_type',
          ignoreDuplicates: false,
        }
      );
      {/** 
      .then(async () => {
        await supabase.rpc('increment_item_count', {
          user_id_input: userId,
          date_input: food.date,
          item_type_input: food.food_type,
        });
      });
    */}
    await incrementItemCount({
      user_id: userId,
      date: food.date,
      item_type: food.food_type,
    });
  }

  // 保存後に再取得
  const { data: finalFoods } = await supabase
    .from('foods')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return finalFoods as Food[];
}