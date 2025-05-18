"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "app/atom";
import { useWeatherData } from "hooks/useWeatherData";
import { NavIcon } from "./WeatherIcon";

const NavWeather = () => {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity,] = useAtom(loadingCityAtom);
  const { isPending, error, data, refetch } = useWeatherData(place);

  useEffect(() => {
    refetch();
  },[place,refetch])

  const firstData = data?.list[0]

  if (isPending) return (
    <div className="h-[40px] w-[40px] bg-gray-300 rounded animate-pulse"></div>
  )

  return (
    <>
    { loadingCity ? (
        <div className="relative h-[40px] w-[40px] bg-gray-300 rounded animate-pulse"></div>
      ) : (
        <NavIcon
          iconname={firstData?.weather[0].icon ?? "01d"}
          description={firstData?.weather[0].description ?? ""}
        />
      )
    }
    </>
  )
}

export default NavWeather