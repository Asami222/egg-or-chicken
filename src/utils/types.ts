export type Egg = {
  date: string; // YYYY-MM-DD
  weather: string;
  egg_color: string;
  is_placeholder: boolean;
};

export type Wing = {
  user_id: string;
  date: string; // 'YYYY-MM-DD'
  wing_image: string;
  is_placeholder: boolean;
};

export type Food = {
  date: string;
  weather: string;
  food_type: string; // 例: 'plant'
  count: number;
  is_placeholder: boolean;
};

export type FoodType = 'plant' | 'fruit' | 'frog' | 'insect';