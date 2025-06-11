// app/atom.ts
import { atom } from 'jotai';
import { getUserPlace, saveUserPlace } from 'libs/userPlace';

// place の状態を持つ基本 atom（初期値：null）
const placeBaseAtom = atom<string | null>(null);

// placeAtom: 読み取り時に Supabase から取得（初回のみ）＋ fallback
export const placeAtom = atom(
  async (get) => {
    const place = get(placeBaseAtom);
    if (place !== null && place.trim() !== '') {
      return place;
    }
    const fetched = await getUserPlace();
    const safePlace = fetched?.trim() || 'Tokyo'; // ← fallback
    return safePlace;
  },
  async (_get, set, newPlace: string) => {
    const cleanPlace = newPlace.trim();
    if (!cleanPlace) return; // 空文字なら無視
    set(placeBaseAtom, cleanPlace);
    await saveUserPlace(cleanPlace);
  }
);

// ローディング状態
export const loadingCityAtom = atom(false);