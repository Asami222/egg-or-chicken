import { createClient } from 'libs/supabase/server'
import { extract9amEntries, generateEggsFromWeather } from 'libs/generateFromWeather';
import { redirect } from 'next/navigation';
import { WeatherData1 } from 'utils/weatherdata';


export async function handleEggUpdateFromWeather(weatherList: (WeatherData1 | undefined)[]) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data?.user;

  if (error || !data?.user) {
    redirect('/login')
  }

  //const nineAmMap = extract9amEntries(weatherList);
  const eggs = generateEggsFromWeather(weatherList, new Date());

  for (const egg of eggs) {
    // Supabaseに同じ日付の卵が存在するか確認
    const { data: existingEgg, error } = await supabase
      .from("eggs")
      .select("*")
      .eq("user_id", user?.id)
      .eq("date", egg.date)
      .single();

    if (!existingEgg) {
      await supabase.from("eggs").insert({
        user_id: user?.id,
        date: egg.date,
        weather: egg.weather,
        egg_color: egg.eggColor,
        is_placeholder: egg.isPlaceholder,
      });
    }
    // 既に存在する場合はスキップ（or 上書きしたいなら update に変更）
  }
}