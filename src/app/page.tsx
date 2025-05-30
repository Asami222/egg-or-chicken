"use client";

//import { useState,useMemo } from 'react'
import { useAtom } from 'jotai';
import { placeAtom } from 'app/atom';
import { useFilteredWeatherData } from "hooks/useFilteredWeatherData"
//import { redirect } from 'next/navigation'
import { Container } from "components/Container";
import { ImgBox } from "components/ui/img";
import { RenderIcons, eggdata } from "components/TopDetail";
//import { handleEggUpdateFromWeather } from 'libs/handleEggUpdateFromWeather';
import { useEggs } from 'hooks/useItems';
import { Egg } from 'utils/types';


const Home = () => {
  const [place] = useAtom(placeAtom);
  const { data: weatherData, isPending: weatherLoading, error } = useFilteredWeatherData(place);
  const { data: eggs, isPending: eggsLoading } = useEggs(weatherData);

  if (weatherLoading || eggsLoading) return <p>読み込み中...</p>;
  if (error) return <div>エラーが発生しました</div>;
  console.log("eggs",eggs)

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // 今日の日付 YYYY-MM-DD
  const eggsBeforeTodayNine = eggs?.filter((egg) => {
    const eggDate = new Date(`${egg.date}T09:00:00+09:00`);
    return eggDate < now;
  });
  
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
        <ImgBox src="/bird.webp" description="鳥" sizes="72vw" className="h-[282px] w-[280px]"/>
      </div>
      <Container className="px-4">
        <div className="flex flex-col gap-3 w-full">
        { eggCounts.map((d,i) => (
          <div key={i} className="flex justify-between items-center w-full">
            <RenderIcons src={d.egg_color} alt='get item' count={d.count}/>
            <p className="font-semibold">{d.count}</p>
          </div>
        ))}
        </div>
      </Container>
    </div>
  );
}

export default Home