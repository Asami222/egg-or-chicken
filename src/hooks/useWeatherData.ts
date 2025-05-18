// hooks/useWeatherData.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { WeatherData } from 'utils/weatherdata';

export const useWeatherData = (place: string) => {
  return useQuery<WeatherData>({
    queryKey: ['weatherData', place],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
    staleTime: 1000 * 60 * 10, // 任意：10分間キャッシュ保持
  });
};