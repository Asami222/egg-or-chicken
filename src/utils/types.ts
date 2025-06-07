export type Egg = {
  id: number;
  date: string; // YYYY-MM-DD
  weather: string;
  egg_color: string;
  is_placeholder: boolean;
};

export type NewEgg = Omit<Egg, 'id' | 'user_id'>;

export type Wing = {
  id: number;
  user_id: string;
  date: string; // 'YYYY-MM-DD'
  wing_image: string;
  is_placeholder: boolean;
};

export type Food = {
  id: number
  user_id: string
  date: string;
  weather: string;
  food_type: string; // 例: 'plant'
  count: number;
  used_date: string;
  is_placeholder: boolean;
};

export type PartialFood = Omit<Food, 'id' | 'user_id' | 'used_date'>;//外す
export type MiniFood = Pick<Food, 'id' | 'user_id' | 'used_date'>;//取り出す
export type MakeFood = Pick<Food, 'date' | 'weather' | 'food_type'| 'count' | 'is_placeholder' >;//取り出す

export type FoodType = 'plant' | 'fruit' | 'frog' | 'insect';