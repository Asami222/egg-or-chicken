//黒卵の補完ロジック
//ユーザーが訪問したタイミングで、過去5日分のうち、卵が保存されていない日を判定。その日の朝9時以降になっている場合のみ、黒卵を生成して保存

export function getMissingDatesWithBlackEggs(existingDates: string[], today: Date): string[] {
  const result: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const eggTime = new Date(`${dateStr}T09:00:00+09:00`);
    const now = new Date();
    if (!existingDates.includes(dateStr) && now.getTime() > eggTime.getTime()) {
      result.push(dateStr);
    }
  }
  return result;
}