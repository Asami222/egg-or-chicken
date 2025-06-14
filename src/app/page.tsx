"use client";

//import { useState,useMemo } from 'react'
import { useAtom } from 'jotai';
import { placeAtom } from 'app/atom';
import { useFilteredWeatherData } from "hooks/useFilteredWeatherData"
//import { redirect } from 'next/navigation'
import { Container } from "components/Container";
import { BigImgBox } from "components/ui/img";
import { RenderIcons } from "components/TopDetail";
//import { handleEggUpdateFromWeather } from 'libs/handleEggUpdateFromWeather';
import { useEggsAndWings } from 'hooks/useItems';
import { Egg } from 'utils/types';
import { useEnsureProfile } from 'hooks/useEnsureProfile';

const Home = () => {
  useEnsureProfile();
  const [place] = useAtom(placeAtom);
  const { data: weatherData, isPending: weatherLoading, error } = useFilteredWeatherData(place);
  const { data: items, isPending: eggsLoading } = useEggsAndWings(weatherData);

  if (weatherLoading || eggsLoading) {
    return (
      <div className="flex flex-col w-full py-4 items-center gap-10 mt-10">
        <EvolvePageSkeleton />
      </div>
    )
  }
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-600">エラーが発生しました</div>;

  const now = new Date();
  //const todayStr = now.toISOString().split('T')[0]; // 今日の日付 YYYY-MM-DD
  const eggsBeforeTodayNine = items?.eggs.filter((egg) => {
    const eggDate = new Date(`${egg.date}T09:00:00+09:00`);
    return eggDate < now;
  });
  const EXCLUDED_WING_IMAGES = ['/chicken.webp'];
  const wings = items?.wings
  const wingImages = wings
  ?.filter(wing => !EXCLUDED_WING_IMAGES.includes(wing.wing_image)) // ← 肉は除外
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((wing) => wing.wing_image);
  //wingImages = ['/img/1.webp', '/img/2.webp', '/img/3.webp']
  const isEvolved = wings?.some(w => w.wing_image === '/chicken.webp');

  const countByEggColor = (eggsBeforeTodayNine: Egg[] | undefined) => {
    if (!eggsBeforeTodayNine) return {};
    const countMap: Record<string, number> = {};

  for (const egg of eggsBeforeTodayNine) {
    
    if (countMap[egg.egg_color]) {
      countMap[egg.egg_color]++;
    } else {
      countMap[egg.egg_color] = 1;
    }
  }
  return countMap;
};

const eggCounts = Object.entries(countByEggColor(eggsBeforeTodayNine)).map(
  ([egg_color, count]) => ({
    egg_color,
    count,
  })
);
{/** eggCounts
  [
  { egg_color: "/obtain/egg-blue.webp", count: 2 },
  { egg_color: "/obtain/egg-nomal.webp", count: 1 },
  ...
]
*/}

  return (
    <div className="flex flex-col w-full py-4 items-center gap-10 mt-10">
      <div className="flex justify-around pl-4 w-full">
      { isEvolved ? 
        <BigImgBox src="/chicken.webp" description="肉" sizes="72vw" className="h-[225px] w-[223px]"/>
        :
        <BigImgBox src="/bird.webp" description="鳥" sizes="72vw" className="h-[282px] w-[280px]"/>
      }
      </div>
      <Container className="px-4">
        <div className="flex flex-col gap-3 w-full">
        { eggCounts.map((d,i) => (
          <div key={i} className="flex justify-between items-center w-full">
            <RenderIcons src={d.egg_color} alt='get item' count={d.count}/>
            <p className="font-semibold">{d.count}</p>
          </div>
        ))}
       {wingImages && wingImages.length > 0 && (
          <div className="flex justify-between items-center w-full">
            <RenderIcons src={wingImages} alt="羽根" count={wingImages.length} />
            <p className="font-semibold">{wingImages.length}</p>
          </div>
        )}
        </div>
      </Container>
    </div>
  );
}

export default Home

const EvolvePageSkeleton = () => {
  return (
    <>
      {/* Top Image */}
      <div className="flex justify-around pl-4 w-full">
        <div className="h-[282px] w-[280px] bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* Egg & Wing Container */}
      <div className="w-full px-4">
        <div className="flex flex-col gap-3 w-full">
          {/* Egg Skeletons */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center w-full animate-pulse"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-[40px] w-[40px] bg-gray-300 rounded-full"
                  />
                ))}
              </div>
              <div className="h-5 w-6 bg-gray-300 rounded" />
            </div>
          ))}

          {/* Wing Skeleton */}
          <div className="flex justify-between items-center w-full animate-pulse">
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[40px] w-[40px] bg-gray-300 rounded-full"
                />
              ))}
            </div>
            <div className="h-5 w-6 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </>
  );
};