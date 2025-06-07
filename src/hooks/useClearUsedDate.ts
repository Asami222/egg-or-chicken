import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client as supabase } from 'libs/supabase/client';

export const useClearUsedDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("foods")
        .update({ used_date: null })
        .eq("id", id);

      if (error) {
        console.error("更新に失敗しました", error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      queryClient.invalidateQueries({ queryKey: ['forecast-foods'] }); // ← ここ修正
    },
  });
};