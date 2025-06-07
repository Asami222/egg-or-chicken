// hooks/useEggs.ts
import { useQuery } from '@tanstack/react-query';
import { client as supabase } from 'libs/supabase/client';
//import { useAtom } from 'jotai';
//import { placeAtom } from 'app/atom';
//import { generateEggsFromWeather } from 'libs/eggUtils';
import { generateAndStoreEggsAndWing, generateAndStoreFoods } from 'libs/generateAndStore';
import { WeatherData1 } from 'utils/weatherdata';
import { Egg, Wing, Food, FoodType } from 'utils/types';
//import { getMissingDatesWithBlackEggs } from 'libs/blackEggsHelper';
//import { useFilteredWeatherData } from './useFilteredWeatherData';


export const useEggsAndWings = (weatherData: (WeatherData1 | undefined)[]) => {
  
  return useQuery<{ eggs: Egg[]; wing: Wing | null; wings: Wing[];}, Error>({
    queryKey: ['eggs_wings'],
    queryFn: async () => {
      {/*if (!weatherData) return [];*/}
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('ログインが必要です');
      return generateAndStoreEggsAndWing(weatherData, user.id);
    },
    enabled: Array.isArray(weatherData) && weatherData.some(Boolean),//「weatherData が配列で、少なくとも1つは有効なオブジェクトが入っている」場合にのみ実行
    staleTime: 1000 * 60 * 10, // 10分キャッシュ
  });
};

//enabledの値他...weatherData.length > 0の場合( 中身があるときのみ実行 ) ...!!weatherDataの場合( weatherData が存在するときのみ実行 )

type FoodsQueryResult = {
  all: Food[];
  countMap: Record<FoodType, number>;
};


export const useFoods = (weatherData: (WeatherData1 | undefined)) => {
  return useQuery<FoodsQueryResult, Error>({
    queryKey: ['foods'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('ログインが必要です');
      // Supabaseに登録・補完
      await generateAndStoreFoods(weatherData, user.id);
      // 最新データを取得
      const { data, error: fetchError } = await supabase
        .from("foods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchError || !data) {
        throw new Error(fetchError?.message || "フード取得に失敗しました");
      }

      // 未使用のみ抽出
      const unUsed = data.filter((f) => f.used_date === null);

      // food_type ごとにカウント
      const countMap = unUsed.reduce((acc, cur) => {
        acc[cur.food_type] = (acc[cur.food_type] || 0) + 1;
        return acc;
      }, {} as Record<FoodType, number>);

      return {
        all: data,
        countMap,
      };
    },
    enabled: !!weatherData && typeof weatherData.dt === 'number',//Array.isArray(weatherData) && weatherData.some(Boolean),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};