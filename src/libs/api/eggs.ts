/*
import { createClient } from 'libs/supabase/server';
import { useQuery } from '@tanstack/react-query';
import { generateEggsFromWeather } from 'libs/generateFromWeather';
import { iconNameDict } from 'utils/weatherDict';
import { getMissingDatesWithBlackEggs } from 'libs/blackEggsHelper';
import { redirect } from 'next/navigation';

export const useSupabase = () => {

  const getEggs = async() => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user;
    
    if (error || !data?.user) {
      redirect('/login')
    }
    const userId = user?.id;
    const today = new Date();

    // 既存卵取得
  const { data: existingEggs } = await supabase
    .from('eggs')
    .select('date')
    .eq('user_id', userId);

  const existingDates = existingEggs?.map(e => e.date) ?? [];

  return existingDates
  }
  
  return useQuery<, Error>({
    queryKey: "eggs", // ユニークな名前
    queryFn: getEggs, // 定義した実行したい関数
    staleTime: Infinity, // キャッシデータの消費期限
  });
}
*/

