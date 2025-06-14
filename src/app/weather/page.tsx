"use client";

import Link from 'next/link';
//import { useWeatherData } from 'hooks/useWeatherData';
import { loadingCityAtom, placeAtom } from 'app/atom';
//import { useAtomValue } from 'jotai';
import WeatherDetail from 'components/WeatherDetail';
import Navbar from 'components/Navbar';
import { format,parseISO,addHours, } from 'date-fns';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { removeZero } from 'utils/weatherDict';
import { useForecastFoods } from 'hooks/useForecastFoods';
import { useFilteredWeatherData, useFilteredTodayWeatherData } from 'hooks/useFilteredWeatherData';
import { ImgBox } from 'components/ui/img';
import { useClearUsedDate } from 'hooks/useClearUsedDate';


const Weather = () => {

  const place = useAtomValue(placeAtom);
  console.log('place =', place);
  const { data: somedays, isPending: someIsPending, error: someError, refetch } = useFilteredWeatherData(place);
  const { data: today, isPending: todayIsPending, error: todayError } = useFilteredTodayWeatherData(place);
  const [loadingCity,] = useAtom(loadingCityAtom);
  const { data: forecastFoods, isLoading, error: foodError } = useForecastFoods();
  const { mutate: clearUsedDate }  = useClearUsedDate();

  useEffect(() => {
    if (place) {
      refetch();
    }
  }, [place, refetch]);

  if (!place) {
    return <div className="min-h-screen flex justify-center items-center">Loading place...</div>;
  }

  const firstData = today;

  // FoodType 型定義
  type FoodType = "plant" | "fruit" | "frog" | "insect";

  // food_type => src のマップ
  const foodImageMap: Record<FoodType, string> = {
    plant: "/food/plant.webp",
    fruit: "/food/fruit.webp",
    frog: "/food/frog.webp",
    insect: "/food/insect.webp",
  };

  // foods を used_date ごとにグループ化
  const foodsByDate = forecastFoods?.reduce((acc, item) => {
    if (!item.used_date) return acc;
    acc[item.used_date] = acc[item.used_date] || [];
    acc[item.used_date].push(item.food_type as FoodType); // ★ 型アサーション
    return acc;
  }, {} as Record<string, FoodType[]>);

  //console.log(uniqueDates)
  //console.log(parseISO(firstData?.dt_txt ?? ""))

  //取得したweatherデータのdt_txtを日本時間にする
  // UTC文字列をISO形式に変換（"T"付きにする）
  //const isoString = firstData?.dt_txt.replace(" ", "T"); // "2025-05-13T18:00:00"
  // ISOをパース → 9時間加算 → 好きなフォーマットで表示
  //const jstFirstDate = addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9);

  if (!place) {
    return <div className="min-h-screen flex justify-center items-center">Loading place...</div>;
  }

  if (someError || todayError || foodError) {
    return <div className="min-h-screen flex justify-center items-center text-red-600">エラーが発生しました</div>;
  }


  if (someIsPending || todayIsPending || isLoading || loadingCity) {
  return (
    <div>
      <div className='flex justify-center mt-6'><Navbar /></div>
      <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        <WeatherSkeleton />
      </div>
    </div>
  );
}

  return (
    <div>
      {/** nav bar */}
      <div className='flex justify-center mt-6'><Navbar/></div>
      <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        {/** tody data */}
        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl text-sky-700 text-center'>{place}</p>
          <Link href='/today'>
            <WeatherDetail 
              description={firstData?.weather[0].description ?? ""}
              weatherIcon={firstData?.weather[0].icon ?? "01d"}
              date={removeZero(addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9))}
              week={format(addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9), "EEEE")}
              temp={firstData?.main.temp ?? 0}
              className='border border-sky-700 hover:bg-sky-50'
            />
          </Link>
        </section>
        {/** 5 day forcast data */}
        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl text-sky-700 text-center'>Forecast</p>
          {somedays.map((d,i) => {
            const forecastDate = format(parseISO(d?.dt_txt ?? ""), "yyyy-MM-dd");
            const foodTypes = foodsByDate?.[forecastDate] || [];
            return (
              <div key={i}>
                <WeatherDetail 
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={removeZero(parseISO(d?.dt_txt ?? ""))}
                  week={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  time={format(parseISO(d?.dt_txt ?? ''), 'h:mm a')}
                  temp={d?.main.temp ?? 0}
                />
                <div className="flex justify-end gap-1 mt-1">
                  {foodTypes.map((type, index) => {
                    const food = forecastFoods?.find(
                      (f) => f.food_type === type && f.used_date === forecastDate
                    );
                    if (!food) return null;
                    return (
                    <ImgBox 
                      key={index} 
                      src={foodImageMap[type]} 
                      description={type} 
                      sizes="10.3vw" 
                      className="h-[40px] w-[40px] cursor-pointer hover:opacity-80 rounded-md bg-white/35"
                      onClick={() => clearUsedDate(food.id)}
                    />
                    );
                  })}
                </div>
              </div>
            )
          })}
        </section>
        </div>
      </div>
  );
}

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56
// https://api.openweathermap.org/data/2.5/forecast?q=tokyo&appid=b3f01ad8a1f86b0e1224a7189e8126e1&cnt=56
// https://api.openweathermap.org/data/2.5/forecast?q=tokyo&appid=b3f01ad8a1f86b0e1224a7189e8126e1&cnt=2
// https://api.openweathermap.org/data/2.5/weather?q=tokyo&units=metric&appid=b3f01ad8a1f86b0e1224a7189e8126e1

export default Weather

const WeatherSkeleton = () => {
  return (
    <div className="px-3 mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* today data */}
      <section className="flex w-full flex-col gap-4">
        <div className="w-40 h-6 mx-auto bg-gray-300 rounded"></div>
        <div className="p-4 border border-sky-700 rounded flex gap-4 items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="w-28 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      {/* forecast data */}
      <section className="flex w-full flex-col gap-4">
        <div className="w-32 h-6 mx-auto bg-gray-300 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-300 rounded flex gap-4 items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

