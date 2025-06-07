import { useQuery } from '@tanstack/react-query';
import { client as supabase } from 'libs/supabase/client';

type ForecastFood = {
  id: number;
  used_date: string;
  food_type: string;
};

export const useForecastFoods = () => {
  return useQuery<ForecastFood[]>({
    queryKey: ['forecast-foods'],
    queryFn: async () => {
      const { data: userResult, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = userResult?.user?.id;
      if (!userId) throw new Error("User not found");

      const { data, error } = await supabase
        .from("foods")
        .select("id, used_date, food_type")
        .eq("user_id", userId)
        .not("used_date", "is", null);

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 任意：5分間キャッシュ
  });
};