"use client";

import { useWeatherData } from 'hooks/useWeatherData';
import { loadingCityAtom, placeAtom } from 'app/atom';
import { format,fromUnixTime,parseISO,addHours, } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Navbar from 'components/Navbar';
import WeatherIcon from 'components/WeatherIcon';
import { Container } from 'components/Container';
import { convertKelvinToCelsius } from 'utils/convertKelvinToCelsius';
import { removeZero } from 'utils/weatherDict';
import { weekNameDict } from 'utils/weatherDict';

const TodayWeather = () => {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity,] = useAtom(loadingCityAtom);
  const { isPending, error, data, refetch } = useWeatherData(place);

  useEffect(() => {
      refetch();
  },[place,refetch])

  const forecasts = data?.list; // OpenWeatherから取得した配列
  const nowJST = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const todayForecasts = forecasts?.filter(item => {
  const jstDate = new Date(item.dt * 1000).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo'
  });
  return jstDate === nowJST;
  });

  const firstData = data?.list[0]

  if (isPending) return (
    <div className='flex items-center min-h-screen justify-center'>
      <p className='animate-bounce'>Loading...</p>
    </div>
  )
  console.log(todayForecasts)

  return (
    <div>
      {/** nav bar */}
      <div className='flex justify-center mt-6'><Navbar location={data?.city.name}/></div>
      <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        { loadingCity ? (
          <TodayPageSkeleton />
        ) : (
        <>
        {/** tody data */}
        <section className='flex w-full flex-col gap-4'>
            <p className='text-2xl text-sky-700 text-center font-semibold'>{data?.city.name}</p>
            <p className='text-xl text-sky-700 pl-2 mt-4'>
              <span>{removeZero(addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9))}</span>
              <span>({weekNameDict[format(addHours(parseISO(firstData?.dt_txt.replace(" ", "T") ?? ''), 9), "EEEE")]})</span>
            </p>
          <Container className='flex-col gap-16 overflow-x-auto justify-between px-3 py-8'>
            {todayForecasts?.map((d,i) =>
              <div 
                key={i}
                className='flex justify-between items-center font-semibold px-5'
              >
                <p className='whitespace-nowrap text-sky-700 text-sm'>{format(addHours(parseISO(d.dt_txt.replace(" ", "T") ?? ''), 9), 'h:mm a')}</p>
                  {/* <WeatherIcon iconname={d.weather[0].icon}/> */}
                <WeatherIcon iconname={d.weather[0].icon} description={d.weather[0].description}/>
                <div className="flex flex-col text-teal-600 max-w-[72px] items-center">
                  <span className='text-3xl'>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</span>
                  <p className="text-xs capitalize text-center">{d.weather[0].description}</p>
                </div>
              </div>
            )}
          </Container>
        </section>
        </> )}
        </div>
      </div>
  )
}

export default TodayWeather

const TodayPageSkeleton = () => {
  return (
    <div className='px-3 mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
      {/* today data */}
      <section className='flex w-full flex-col gap-4'>
        {/* city name */}
        <div className="h-6 w-1/3 bg-sky-200 rounded mx-auto animate-pulse" />
        {/* date and day */}
        <div className="h-5 w-1/2 bg-sky-100 rounded ml-2 animate-pulse" />

        <div className='flex-col gap-16 overflow-x-auto justify-between px-3 py-8 flex animate-pulse'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='flex justify-between items-center font-semibold px-5 gap-3'
            >
              {/* time */}
              <div className='h-4 w-16 bg-sky-100 rounded' />

              {/* icon */}
              <div className='w-10 h-10 bg-gray-200 rounded-full' />

              {/* temperature and description */}
              <div className='flex flex-col items-center max-w-[72px] gap-1'>
                <div className='h-6 w-10 bg-teal-100 rounded' />
                <div className='h-3 w-16 bg-teal-100 rounded' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};