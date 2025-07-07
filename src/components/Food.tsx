"use client";

import { client as supabase } from 'libs/supabase/client';
import { parse, format } from 'date-fns';
import { ja } from 'date-fns/locale';
//import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
//import Image, { StaticImageData } from "next/image"
import { useAtom } from 'jotai';
import { placeAtom } from 'app/atom';
import { useFilteredTodayWeatherData } from 'hooks/useFilteredWeatherData';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Container } from "components/Container"
//import plantImg from "../../../public/food/plant.webp"
//import frogImg from "../../../public/food/frog.webp"
//import insectImg from "../../../public/food/insect.webp"
//import fruitImg from "../../../public/food/fruit.webp"
import FoodCheckbox from "components/FoodCheckbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { IoCloseOutline } from "react-icons/io5";
import { ImgBox } from 'components/ui/img';
import { useFoods } from 'hooks/useItems';
import type { Food, FoodType, PartialFood } from 'utils/types';

const imgdata: {
  food_type: FoodType;
  src: string;
  alt: string;
  exchange?: string;
}[] = [
  { food_type: "plant", src: '/food/plant.webp', alt: "植物", exchange: '/food/fruit.webp' },
  { food_type: "fruit", src: '/food/fruit.webp', alt: "果実", exchange: '/food/frog.webp' },
  { food_type: "frog", src: '/food/frog.webp', alt: "両生類", exchange: '/food/insect.webp' },
  { food_type: "insect", src: '/food/insect.webp', alt: "昆虫" },
];

type FoodDialogData = {
  food: PartialFood;
  src: string;
  alt: string;
  exchange?: string;
};

const Food = () => {
  const [place] = useAtom(placeAtom);
  const { data: weatherData, isPending: weatherLoading, error } = useFilteredTodayWeatherData(place);
  const { data: foodsData, isPending: foodsLoading, refetch } = useFoods(weatherData);
  const [selectedItem, setSelectedItem] = useState<FoodDialogData | undefined>(undefined);
  const errorMessageRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    errorMessageRef.current = errorMessage;
  }, [errorMessage]);

  const foodOrder: FoodType[] = ['plant', 'fruit', 'frog', 'insect'];

  // 使用済み日付（food_typeごとのSet）を作成
 const usedDatesByType = useMemo(() => {
  const result: Record<FoodType, Set<string>> = {
    frog: new Set(),
    fruit: new Set(),
    insect: new Set(),
    plant: new Set(),
  };

  if (foodsData?.all) {
    for (const food of foodsData.all) {
      if (food.used_date && food.food_type) {
        const foodType = food.food_type as FoodType; // キャストで型を明示
        result[foodType].add(food.used_date);
      }
    }
  }

  return result;
}, [foodsData]);

  if (weatherLoading || foodsLoading) return <p>読み込み中...</p>;
  if (error) return <div>エラーが発生しました</div>;
  if (!foodsData) return <p>データが取得できませんでした</p>;
  /*
  function open(item) {
    setSelectedItem(item);
  }
  */

  // Supabaseのfoodsをマップ形式に変換（food_type -> Food）
 // const foodMap = Object.fromEntries(foods.map(f => [f.food_type, f]));

  // imgdataとfoodsをマージ
  const fullFoodList: FoodDialogData[] = imgdata.map(data => {
    const count = foodsData.countMap[data.food_type] ?? 0;
    return {
      food: {
        food_type: data.food_type,
        count,
        date: "",
        weather: "",
        is_placeholder: false,
      },
      src: data.src,
      alt: data.alt,
      exchange: data.exchange,
    };
  });

  const handleDeleteFood = async (countToUse: number, form: { date: string[]; number: number }) => {
    setErrorMessage(null); // 初期化
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (!user || !selectedItem || !form.date) return;
    if (userError || !user?.user) {
      console.error("ユーザー情報の取得失敗:", userError);
      return;
    }

    const userId = user.user.id;
    // 未使用のfoodsデータを全件（countToUse * 日数分）取得
    const totalCount = countToUse * form.date.length;

    const { data, error } = await supabase
    .from("foods")
    .select("id")
    .eq("user_id", userId)
    .eq("food_type", selectedItem.food.food_type)
    .is("used_date", null) // 未使用のものだけ対象にする
    .order("created_at", { ascending: true })
    .limit(totalCount);

  if (error || !data) {
    console.error("取得失敗:", error);
    return;
  }

  const duplicatedDates: string[] = [];

  // 日付ごとにデータを分割して used_date を更新
  for (let i = 0; i < form.date.length; i++) {
    const rawDate = form.date[i];
    const cleanedDate = rawDate.replace(/\(.*?\)/g, ''); // "6月5日(木)" → "6月5日"
    const parsedDate = parse(cleanedDate, 'M月d日', new Date(), { locale: ja });
    const usedDate = format(parsedDate, 'yyyy-MM-dd'); // → "2025-06-05"
    //const usedDate = parsed.toISOString().split('T')[0]; // "2025-06-05"

    // 事前に Supabase で重複確認
    const { data: existing, error: existError } = await supabase
      .from("foods")
      .select("id")
      .eq("user_id", userId)
      .eq("food_type", selectedItem.food.food_type)
      .eq("used_date", usedDate);

    if (existError) {
      console.error("重複チェック失敗:", existError);
      continue;
    }

    if (existing && existing.length > 0) {
      // すでに存在 → スキップ + エラーメッセージ表示
      duplicatedDates.push(rawDate);
      continue;
    }

    // 対象IDを slice で取り出す
    const start = i * countToUse;
    const end = start + countToUse;
    const idsToUpdate = data.slice(start, end).map(item => item.id);

    if (idsToUpdate.length === 0) {
      console.warn(`日付 ${usedDate} に対するフードが不足しています`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("foods")
      .update({ used_date: usedDate })
      .in("id", idsToUpdate);

    if (updateError) {
      console.error(`日付 ${usedDate} の使用記録更新失敗:`, updateError);
    } else {
      console.log(`${idsToUpdate.length} 件の food を ${usedDate} に使用として記録しました`);
    }
  }
  // エラーがあればまとめて表示
  if (duplicatedDates.length > 0) {
    const msg = `以下の日付にはすでに ${selectedItem.food.food_type} が登録されています: ${duplicatedDates.join('、')}`;
    setErrorMessage(msg);
    console.log('エラー表示メッセージ:', msg); // ✅ これが表示されるか確認
  }
  await refetch();
};

 function open(foodData: FoodDialogData) {
  setSelectedItem(foodData);
}

function close() {
  if (errorMessageRef.current) return;
  setSelectedItem(undefined);
}

  return (
    <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-6'>
      <section className='flex w-full flex-col gap-8'>
        <p className="text-sm text-sky-700 px-2 font-medium">
          天気予報を確認して当日朝9時までに適した食べ物を与えましょう！<br/>
          （天気予報は変わる可能性があるので注意しましょう）
        </p>
        <Container className="px-6 py-5">
            <ul className="grid grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-8 mx-auto">
            { foodOrder.flatMap( type => 
              fullFoodList
              .filter(d => d.food.food_type === type)
              .map((d,i) => (
                <li key={`${type}-${i}`} data-testid={`food-${type}`} className="flex flex-col gap-2">
                  <ImgBox
                    src={d.src}
                    description={d.alt}
                    sizes="23.1vw"
                    className="h-[90px] w-[90px] cursor-pointer hover:opacity-80"
                    onClick={() => open(d)}
                  />
                  <p data-testid={`count-${type}`} className="text-xs text-center font-medium">{d.food.count}</p>
                </li>
              ))
            )}
          </ul>
        </Container>
      </section>

      {/* ダイアログはループ外で一つだけ描画 */}
      {selectedItem && (
        <Dialog open={true} onClose={close} as="div" className="relative z-10 focus:outline-none">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-white p-6 border border-sky-100 data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <DialogTitle as="h3" className="font-semibold text-center text-slate-800">
                  {selectedItem.alt}
                </DialogTitle>
                    <div className="flex items-center gap-5 justify-center my-4">
                      <ImgBox src={selectedItem.src} description={selectedItem.alt} sizes="18vw" className="h-[70px] w-[70px]"/>
                      <p className="font-medium text-slate-800">{selectedItem.food.count}</p>
                    </div>
                  <FoodCheckbox 
                    key={selectedItem.food.food_type}
                    imgexchange={selectedItem.exchange} 
                    imgdescription={selectedItem.alt} 
                    maxCount={selectedItem.food.count} 
                    onDelete={handleDeleteFood} 
                    errorMessage={errorMessage} 
                    onClose={close}
                    usedDates={usedDatesByType[selectedItem.food.food_type as FoodType] ?? new Set()}
                  />
                    <div className="mt-4 flex justify-end">
                      <button onClick={close} className="flex gap-1 items-center cursor-pointer text-slate-600 hover:text-slate-800">
                        <IoCloseOutline />
                        <p className="text-sm">閉じる</p>
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>
            )}
    </div>
  )
}
export default Food