"use client";

import { useQuery } from '@tanstack/react-query'
import { loadingCityAtom, placeAtom } from 'app/atom';
import axios from 'axios'
import Container from 'components/Container';
import ForecastWeatherDetail from 'components/ForecastWeatherDetail';
import Navbar from 'components/Navbar';
import WeatherDetails from 'components/WeatherDetails';
import WeatherIcon from 'components/WeatherIcon';
import { format,fromUnixTime,parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { convertKelvinToCelsius } from 'utils/convertKelvinToCelsius';
import convertWindSpeed from 'utils/convertWindSpeed';
import getDayOrNightIcon from 'utils/getDayOrNightIcon';
import metersToKilometers from 'utils/metersToKilometers';
import { WeatherData } from 'utils/weatherdata'

const Weather = () => {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity,] = useAtom(loadingCityAtom);
  const { isPending, error, data, refetch } = useQuery<WeatherData> ({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
      return data;
    }
  });

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
      return entryDate === date && entryTime >= 6;
    })
  })
  const newFirstDataForEachDate = firstDataForEachDate.slice(0, 5);

  if (isPending) return (
    <div className='flex items-center min-h-screen justify-center'>
      <p className='animate-bounce'>Loading...</p>
    </div>
  )

  return (
    <div>
      {/** nav bar */}
      <Navbar location={data?.city.name}/>
      <div className='px-3 mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        { loadingCity ? (
          <WeatherSkeleton />
        ) : (
        <>
        {/** tody data */}
        <section className='space-y-4'>
          <div className='space-y-2'>
            <h2 className='flex gap-1 text-2xl items-end'>
            {firstData?.dt_txt ? (
              <>
                <p>{format(parseISO(firstData.dt_txt), 'EEEE')}</p>
                <p className='text-lg'>({format(parseISO(firstData.dt_txt), 'dd.MM.yyyy')})</p>
              </>
            ) : (
              <div className="w-40 h-6 bg-gray-300 rounded animate-pulse"></div>
            )}
            </h2>
            <Container className='gap-10 px-6 items-center'>
              {/** temprature */}
              <div className='flex flex-col px-4'>
                <span className='text-5xl'>
                {convertKelvinToCelsius(firstData?.main.temp ?? 295.09)}°
                </span>
                <p className='text-xs space-x-1 whitespace-nowrap'>
                  <span>Feels like</span>
                  <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className='text-xs space-x-2'>
                  <span>
                  {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓{" "}
                  </span>
                  <span>
                  {" "}{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/** time and weather icon */}
              <div className='flex gap-16 overflow-x-auto w-full justify-between pr-3'>
                {data?.list.map((d,i) =>
                  <div 
                    key={i}
                    className='flex flex-col justify-between gap-2 items-center text-xs font-semibold'
                  >
                    <p className='whitespace-nowrap'>{format(parseISO(d.dt_txt),'h:mm a')}</p>
                    {/* <WeatherIcon iconname={d.weather[0].icon}/> */}
                    <WeatherIcon iconname={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}/>
                    <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                )}
              </div>
            </Container>
          </div>
          <div className='flex gap-4'>
            {/** left */}
            <Container className='w-fit justify-center flex-col px-4 items-center'>
              <p className='capitalize text-center '>{firstData?.weather[0].description}</p>
              <WeatherIcon iconname={getDayOrNightIcon(firstData?.weather[0].icon ?? "",firstData?.dt_txt ?? "")}/>
            </Container>
            <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
              <WeatherDetails 
                visability={metersToKilometers(firstData?.visibility ?? 10000)} 
                airPressure={`${firstData?.main.pressure}hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1746215245),'H:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1746264524),'H:mm')}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                />
            </Container>
            {/** right */}
          </div>
        </section>
        {/** 7 day forcast data */}
        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl'>Forcast (7 days)</p>
          {newFirstDataForEachDate.map((d,i) => (
          <ForecastWeatherDetail 
            key={i}
            description={d?.weather[0].description ?? ""}
            weatherIcon={d?.weather[0].icon ?? "01d"}
            date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
            day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
            feels_like={d?.main.feels_like ?? 0}
            temp={d?.main.temp ?? 0}
            temp_max={d?.main.temp_max ?? 0}
            temp_min={d?.main.temp_min ?? 0}
            airPressure={`${d?.main.pressure}hPa`}
            humidity={`${d?.main.humidity}%`}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 1746215245),"H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 1746264524),"H:mm")}
            visability={`${metersToKilometers(d?.visibility ?? 10000)}`}
            windSpeed={`${convertKelvinToCelsius(d?.wind.speed ?? 1.64)}`}
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
      <>
      <section className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <div className="w-24 h-6 bg-gray-300 rounded"></div>
            <div className="w-32 h-5 bg-gray-300 rounded"></div>
          </h2>
          <div className="flex gap-10 px-6 items-center">
            {/* 気温 */}
            <div className="flex flex-col px-4 gap-2">
              <div className="w-20 h-12 bg-gray-300 rounded"></div>
              <div className="w-24 h-3 bg-gray-300 rounded"></div>
              <div className="w-28 h-3 bg-gray-300 rounded"></div>
            </div>
            {/* 時間帯とアイコン */}
            <div className="flex gap-4 overflow-x-auto w-full pr-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-xs">
                  <div className="w-12 h-3 bg-gray-300 rounded"></div>
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 天気詳細セクション */}
        <div className="flex gap-4">
          {/* 左：天気アイコンと説明 */}
          <div className="flex flex-col items-center justify-center px-4 gap-2">
            <div className="w-24 h-3 bg-gray-300 rounded"></div>
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>

          {/* 中央：詳細情報 */}
          <div className="flex gap-4 px-6 bg-gray-200 rounded-lg overflow-x-auto w-full py-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-20 h-3 bg-gray-300 rounded"></div>
                <div className="w-24 h-3 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 w-full animate-pulse">
        <div className="w-40 h-6 bg-gray-300 rounded"></div>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col gap-1 items-end">
              <div className="w-16 h-3 bg-gray-300 rounded"></div>
              <div className="w-24 h-3 bg-gray-300 rounded"></div>
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

