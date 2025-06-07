import { client as supabase } from 'libs/supabase/client';
import { WeatherData1 } from 'utils/weatherdata';
import { generateEggsFromWeather } from './generateFromWeather';
import { Egg, NewEgg, Wing, Food } from 'utils/types';

export async function handleEggsGenerationAndStorage(
  weatherData: (WeatherData1 | undefined)[],
  userId: string,
  today: Date,
  todayStr: string,
  isPastNine: boolean,
  wings: Wing[],
  foods: Food[]
): Promise<Egg[]> {
  const now = new Date();

  const { data: existingEggs } = await supabase
    .from('eggs')
    .select('*')
    .eq('user_id', userId);

  const existingMap = new Map<string, string>(
    (existingEggs ?? []).map((egg) => [egg.date, egg.egg_color])
  );

  const newEggs = generateEggsFromWeather(weatherData);

  if (isPastNine) {
  const todayFoods = foods.filter(food => food.used_date === todayStr && food.user_id === userId);
  const additionalEggs: NewEgg[] = [];

  for (const egg of newEggs) {
    if (egg.date !== todayStr) continue;

    const food = todayFoods.find(f => f.user_id === userId);
    if (!food) continue;

    const foodType = food.food_type;

    if (foodType === 'fruit') {
      egg.egg_color = '/obtain/egg-red.webp';
    }

    if (foodType === 'insect') {
      for (let i = 0; i < 10; i++) {
        additionalEggs.push({
          ...egg,
          is_placeholder: false,
          egg_color: '/obtain/egg-red.webp',
          date: todayStr,
        });
      }
    }
  }

  newEggs.push(...additionalEggs);
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inserts: any[] = [];
  const updates: { egg: NewEgg }[] = [];

  for (const egg of newEggs) {
    const eggDate = new Date(`${egg.date}T09:00:00+09:00`);
    const isToday = egg.date === todayStr;
    const isFuture = new Date(egg.date) > today;
    const isEggPastNine = new Date() > eggDate;
    const alreadyExists = existingMap.has(egg.date);

    if (!alreadyExists) {
      inserts.push({ ...egg, user_id: userId });
    } else if ((isToday && !isEggPastNine) || isFuture) {
      updates.push({ egg });
    }
  }

  if (inserts.length > 0) {
    await supabase.from('eggs').insert(inserts);
  }

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

  // 🥚 卵の変換処理（beforeNineEggs ベース）
  const { data: finalEggsData } = await supabase
    .from('eggs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  const finalEggs = finalEggsData as Egg[] || [];
  const beforeNineEggs = finalEggs.filter((egg) => {
    const eggDate = new Date(`${egg.date}T09:00:00+09:00`);
    return eggDate < now;
  });

  const grouped = {
    red: beforeNineEggs.filter(e => e.egg_color === '/obtain/egg-red.webp'),
    white: beforeNineEggs.filter(e => e.egg_color === '/obtain/egg-nomal.webp'),
    blue: beforeNineEggs.filter(e => e.egg_color === '/obtain/egg-blue.webp'),
    gold: beforeNineEggs.filter(e => e.egg_color === '/obtain/egg-gold.webp'),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newEggsToInsert: any[] = [];
  const eggIdsToDelete: number[] = [];

  const whiteToRed = Math.floor(grouped.white.length / 20);
  const redToGold = Math.floor(grouped.red.length / 30);
  const blueToGold = Math.floor(grouped.blue.length / 15);

  // 白→赤
  eggIdsToDelete.push(...grouped.white.slice(0, whiteToRed * 20).map(e => e.id));
  for (let i = 0; i < whiteToRed; i++) {
    newEggsToInsert.push({
      user_id: userId,
      date: todayStr,
      weather: null,
      egg_color: '/obtain/egg-red.webp',
      is_placeholder: false,
    });
  }

  // 赤→金
  eggIdsToDelete.push(...grouped.red.slice(0, redToGold * 30).map(e => e.id));
  for (let i = 0; i < redToGold; i++) {
    newEggsToInsert.push({
      user_id: userId,
      date: todayStr,
      weather: null,
      egg_color: '/obtain/egg-gold.webp',
      is_placeholder: false,
    });
  }

  // 青→金
  eggIdsToDelete.push(...grouped.blue.slice(0, blueToGold * 15).map(e => e.id));
  for (let i = 0; i < blueToGold; i++) {
    newEggsToInsert.push({
      user_id: userId,
      date: todayStr,
      weather: null,
      egg_color: '/obtain/egg-gold.webp',
      is_placeholder: false,
    });
  }

  // 金 → chick
  if (grouped.gold.length >= 20) {
    eggIdsToDelete.push(...grouped.gold.slice(0, 20).map(e => e.id));
    await supabase.from('wings').insert([{
      user_id: userId,
      date: todayStr,
      wing_image: '/chick.webp',
    }]);
  }

  // 金1個以上 & chicken → bird に進化
  if (grouped.gold.length >= 1 && wings.some(w => w.wing_image === '/chicken.webp')) {
    const chickenWing = wings.find(w => w.wing_image === '/chicken.webp');
    if (chickenWing) {
      await supabase
        .from('wings')
        .update({ wing_image: '/bird.webp' })
        .eq('id', chickenWing.id);
    }
  }

  // 卵削除・追加
  if (eggIdsToDelete.length > 0) {
    await supabase.from('eggs').delete().in('id', eggIdsToDelete);
  }
  if (newEggsToInsert.length > 0) {
    await supabase.from('eggs').insert(newEggsToInsert);
  }

  const { data: refreshedEggs } = await supabase
    .from('eggs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return refreshedEggs as Egg[];
}