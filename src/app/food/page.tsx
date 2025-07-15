import Food from "components/Food";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ごはん | Egg or Chicken",
  description: "鳥が食べるごはんを選んで与えてみましょう。他のごはんに交換したり、羽を落とさないように日付に植物を設定してみましょう！"
}

export default function Page() {
  return <Food />
}