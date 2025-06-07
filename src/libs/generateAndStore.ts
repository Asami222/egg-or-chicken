import { client as supabase } from 'libs/supabase/client';
//import { getMissingDatesWithBlackEggs } from './blackEggsHelper';
import { generateFoodsFromWeather } from './generateFromWeather';
//import { incrementItemCount } from 'utils/incrementItemCount';
import { WeatherData1 } from 'utils/weatherdata';
import { Egg, Wing, Partial2Food } from 'utils/types';
import { handleEggsGenerationAndStorage } from './handleEggsGenerationAndStorage';
import { handleWingGenerationAndEvolution } from './handleWingGenerationAndEvolution';
//import { iconToFoodsMap, thunderIcons } from "utils/weatherDict";

//保存・更新処理

export async function generateAndStoreEggsAndWing(
  weatherData: (WeatherData1 | undefined)[],
  userId: string,
): Promise<{ eggs: Egg[]; wing: Wing | null; wings: Wing[]}> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());// 00:00の今日
  const todayStr = today.toISOString().split('T')[0];
  const isPastNine = now.getHours() >= 9;


  const { data: foods, error: foodError } = await supabase
    .from('foods')
    .select('*')
    .eq('used_date', todayStr)
    .eq('user_id', userId);

  if (foodError) throw foodError;


  const { wing, wings } = await handleWingGenerationAndEvolution(
    userId,
    todayStr,
    isPastNine,
    foods
  );
  
  const eggs = await handleEggsGenerationAndStorage(
    weatherData,
    userId,
    today,
    todayStr,
    isPastNine,
    wings,
    foods
  );

  return { eggs, wing, wings };
}


// libs/generateAndStoreFoods.ts

export async function generateAndStoreFoods(
  weatherData: WeatherData1 | undefined,
  userId: string
): Promise<Partial2Food[]> {
  const generatedFoods = generateFoodsFromWeather(weatherData);

  // userIdをマージ
  const foodsWithUserId: Partial2Food[] = generatedFoods.map((food) => ({
    ...food,
    user_id: userId,
  }));

  // 一括アップサート（高速で効率的）
  const { error } = await supabase
    .from("foods")
    .upsert(foodsWithUserId, { onConflict: "user_id,date,food_type" });

  if (error) {
    console.error("Upsert error:", error.message, error.details);
  }

  return foodsWithUserId;
}

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


