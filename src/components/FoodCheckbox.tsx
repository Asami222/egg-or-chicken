"use client";

import { useState,useMemo } from 'react'
import { useAtom } from 'jotai';
import { placeAtom } from 'app/atom';
import { useFilteredWeatherData } from "hooks/useFilteredWeatherData"
import { removeZero } from 'utils/weatherDict';
import { format } from 'date-fns';
import { shortWeekNameDict } from 'utils/weatherDict';
import { ImgBox } from './WeatherIcon';

type FoodCheckboxProps = {
    imgexchange?: string
    imgdescription: string
}


const FoodCheckbox = (props: FoodCheckboxProps) => {

  const [place] = useAtom(placeAtom);
  const { data, isPending, error } = useFilteredWeatherData(place);

  const setting = useMemo(() => {
    if (!data) return [];

    return data.map((d) => {
      const date = new Date(d? d.dt * 1000 : ''); // UNIX timestamp → Date
      return {
        date: `${removeZero(date)}(${shortWeekNameDict[format(date, 'EEEE')]})`,
      };
    });
  }, [data]);

  const initialFormValue = setting[0] ? [setting[0].date] : []; // setting[0] が存在するかチェック

  type FormState = {
  date: string[];
  number: number;
};
  
  const [ form, setForm ] = useState<FormState>({
    date: initialFormValue,
    number: 0,
  });
/*
  if (isPending) return <WeatherSkeleton />;
  if (error) return <ErrorMessage />;
*/
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>エラーが発生しました</div>;

  const handleFormMulti = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    let newDates = [...form.date];

    if (checked) {
      if (!newDates.includes(value)) {
        newDates.push(value);
      }
    } else {
      newDates = newDates.filter((v) => v !== value);
    }

    setForm((prev) => ({
      ...prev,
      date: newDates,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setForm((prev) => ({
      ...prev,
      number: isNaN(value) ? 0 : value, // NaN対策
    }));
  };

  const show = () => {
    console.log("選択された日付:", form.date);
    console.log("選択された個数:", form.number);
  }

  return (
    <form className='text-center'>
      <fieldset>
        <legend className="text-sm font-medium text-slate-800 mb-4">設定する日付をチェックしてください</legend>
          <div className='flex flex-col gap-4'>
            {setting.map((item,i) => (
              <div key={i} className='flex items-center gap-3 justify-center'>
                <label className='flex items-center cursor-pointer relative' htmlFor={`date_${i}`}>
                <input
                  id={`date_${i}`}
                  name="date"
                  type='checkbox'
                  value={item.date}
                  checked={form.date.includes(item.date)}
                  onChange={handleFormMulti}
                  className='peer h-5 w-5 appearance-none rounded border border-sky-700 checked:bg-sky-600 checked:border-sky-600 cursor-pointer transition'
                />
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                </label>
                <label htmlFor={`date_${i}`} className='text-sky-700 font-medium'>{item.date}</label>
              </div>
            ))}
          </div>
      </fieldset>
      { props.imgexchange && 
      <div className='flex gap-2 items-center mt-4 justify-center'>
          <ImgBox src={props.imgexchange} description={props.imgdescription} sizes='13vw' className='h-[50px] w-[50px]'/>
          <input type='number' id="tentacles" name="tentacles" min="1" max="50" value={form.number} onChange={handleNumberChange} className='border border-sky-200 rounded'/>
          <p className='text-slate-800'>個と交換</p>
      </div>
      }
      <button type='button' onClick={show} className="px-4 py-2 mt-6 bg-sky-600 text-sm text-white font-semibold rounded-lg hover:bg-sky-700 transition">設定する</button>
    </form>
  )
}

export default FoodCheckbox