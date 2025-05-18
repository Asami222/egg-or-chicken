"use client";

import Link from 'next/link';
import { useWeatherData } from 'hooks/useWeatherData';
import { loadingCityAtom, placeAtom } from 'app/atom';
import WeatherDetail from 'components/WeatherDetail';
import Navbar from 'components/Navbar';
import { format,fromUnixTime,parseISO,addHours, } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { removeZero } from 'utils/weatherDict';

const Weather = () => {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity,] = useAtom(loadingCityAtom);
  const { isPending, error, data, refetch } = useWeatherData(place);

  useEffect(() => {
    refetch();
  },[place,refetch])

  const firstData = data?.list[0]
  console.log("data",data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 18;
    })
  })
  
  const removeFirstDataForEachDate = firstDataForEachDate.slice(1, 6);
  const newFirstDataForEachDate = removeFirstDataForEachDate.filter(item => item !== undefined);

  //console.log(uniqueDates)
  //console.log(parseISO(firstData?.dt_txt ?? ""))

  //取得したweatherデータのdt_txtを日本時間にする
  // UTC文字列をISO形式に変換（"T"付きにする）
  //const isoString = firstData?.dt_txt.replace(" ", "T"); // "2025-05-13T18:00:00"
  // ISOをパース → 9時間加算 → 好きなフォーマットで表示
  //const jstFirstDate = addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9);

  if (isPending) return (
    <div className='flex items-center min-h-screen justify-center'>
      <p className='animate-bounce'>Loading...</p>
    </div>
  )

  return (
    <div>
      {/** nav bar */}
      <div className='flex justify-center mt-6'><Navbar location={data?.city.name}/></div>
      <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        { loadingCity ? (
          <WeatherSkeleton />
        ) : (
        <>
        {/** tody data */}
        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl text-sky-700 text-center'>{data?.city.name}</p>
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
          {newFirstDataForEachDate.map((d,i) => (
          <WeatherDetail 
            key={i}
            description={d?.weather[0].description ?? ""}
            weatherIcon={d?.weather[0].icon ?? "01d"}
            date={removeZero(parseISO(d?.dt_txt ?? ""))}
            week={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
            time={format(parseISO(d?.dt_txt), 'h:mm a')}
            temp={d?.main.temp ?? 0}
          />
        ))}
        </section>
        </> )}
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

