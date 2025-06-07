import { NewEgg, Food } from "utils/types";
import { WeatherData1 } from "utils/weatherdata";
import { iconNameToEggDict, iconToFoodsMap, thunderIcons } from "utils/weatherDict";

//ロジック

export function generateEggsFromWeather(
  weatherData: (WeatherData1 | undefined)[]
): NewEgg[] {
  const eggs: NewEgg[] = [];
  //const now = new Date();

 
  for (const entry of weatherData) {
    if (!entry || !entry.dt) {
      continue;
    }
     
    const dateStr = new Date(entry.dt * 1000).toISOString().split('T')[0];
    //const eggDate = new Date(`${dateStr}T09:00:00+09:00`); // JSTの朝9時
    //const isToday = dateStr === today.toISOString().split("T")[0];
    //const isPastNine = now.getTime() > eggDate.getTime();

    const icon = entry.weather?.[0]?.icon ?? "unknown";
    const color = iconNameToEggDict[icon] ?? "egg-nomal";

    eggs.push({
      date: dateStr,
      weather: icon,
      egg_color: color,
      is_placeholder: !entry.weather || !entry.weather[0],
    });
  }
  return eggs;
}

// libs/generateFoodsFromWeather.ts
export function generateFoodsFromWeather(
  weatherData: WeatherData1 | undefined
): Omit<Food, "user_id">[] {
  const foods: Omit<Food, "user_id">[] = [];

  if (!weatherData || typeof weatherData.dt !== "number") return foods;

  const date = new Date(weatherData.dt * 1000);
  const dateStr = date.toISOString().split("T")[0];
  const icon = weatherData.weather?.[0]?.icon ?? "unknown";
  const now = new Date();
  const isAfterNine = now.getHours() >= 9;

  for (const [foodType, validIcons] of Object.entries(iconToFoodsMap)) {
    if (validIcons.includes(icon)) {
      foods.push({
        date: dateStr,
        weather: icon,
        food_type: foodType,
        count: 1,
        is_placeholder: !isAfterNine,
      });
    }
  }

  if (thunderIcons.includes(icon)) {
    if (Math.random() < 0.5) {
      foods.push({
        date: dateStr,
        weather: icon,
        food_type: "frog",
        count: 1,
        is_placeholder: false,
      });
    }
    if (Math.random() < 0.25) {
      foods.push({
        date: dateStr,
        weather: icon,
        food_type: "insect",
        count: 1,
        is_placeholder: false,
      });
    }
  }

  return foods;
}


/*
export function getEggColorFromWeather(weather: string): string {
  switch (weather) {
    case "Clear":
      return "/eggs/egg_yellow.jpg";
    case "Rain":
      return "/eggs/egg_blue.jpg";
    case "Snow":
      return "/eggs/egg_white.jpg";
    case "Clouds":
      return "/eggs/egg_gray.jpg";
    default:
      return "/eggs/egg_black.jpg";
  }
}
*/
/*
export function extract9amEntries(weatherList: WeatherData1[] | undefined): Record<string, any> {
  const result: Record<string, any> = {};

  for (const entry of weatherList) {
    const jstDate = new Date(entry.dt * 1000);
    jstDate.setHours(jstDate.getHours() + 9);

    const dateStr = jstDate.toISOString().split("T")[0];
    const hour = jstDate.getHours();

    // 9時±1時間の範囲なら候補とする
    if (hour >= 8 && hour <= 10) {
      // 最も9時に近いデータを保存（1日1件）
      if (!result[dateStr] || Math.abs(hour - 9) < Math.abs(result[dateStr].jstHour - 9)) {
        result[dateStr] = { ...entry, jstHour: hour };
      }
    }
  }

  return result;
}
*/