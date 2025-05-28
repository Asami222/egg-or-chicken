import { client as supabase } from 'libs/supabase/client';

/**
 * 指定された item の count を +1 する Supabase RPC 呼び出し
 */
export async function incrementItemCount({
  user_id,
  date,
  item_type,
}: {
  user_id: string;
  date: string;
  item_type: string;
}): Promise<void> {
  const { error } = await supabase.rpc('increment_item_count', {
    user_id_input: user_id,
    date_input: date,
    item_type_input: item_type,
  });

  if (error) {
    console.error('Failed to increment item count via RPC:', error);
    throw error;
  }
}