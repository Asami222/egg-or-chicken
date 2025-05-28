// hooks/useEggs.ts
import { useQuery } from '@tanstack/react-query';
import { client as supabase } from 'libs/supabase/client';
//import { useAtom } from 'jotai';
//import { placeAtom } from 'app/atom';
//import { generateEggsFromWeather } from 'libs/eggUtils';
import { generateAndStoreEggs, generateAndStoreFoods } from 'libs/generateAndStore';
import { WeatherData1 } from 'utils/weatherdata';
import { Egg, Food } from 'utils/types';
//import { getMissingDatesWithBlackEggs } from 'libs/blackEggsHelper';
//import { useFilteredWeatherData } from './useFilteredWeatherData';


export const useEggs = (weatherData: (WeatherData1 | undefined)[]) => {
  
  return useQuery<Egg[], Error>({
    queryKey: ['eggs'],
    queryFn: async () => {
      {/*if (!weatherData) return [];*/}
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('ログインが必要です');
      return generateAndStoreEggs(weatherData, user.id);
    },
    enabled: Array.isArray(weatherData) && weatherData.some(Boolean),//「weatherData が配列で、少なくとも1つは有効なオブジェクトが入っている」場合にのみ実行
    staleTime: 1000 * 60 * 10, // 10分キャッシュ
  });
};

//enabledの値他...weatherData.length > 0の場合( 中身があるときのみ実行 ) ...!!weatherDataの場合( weatherData が存在するときのみ実行 )

export const useFoods = (weatherData: (WeatherData1 | undefined)[]) => {
  return useQuery<Food[], Error>({
    queryKey: ['foods'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('ログインが必要です');
      return generateAndStoreFoods(weatherData, user.id);
    },
    enabled: Array.isArray(weatherData) && weatherData.some(Boolean),
    staleTime: 1000 * 60 * 10,
  });
};