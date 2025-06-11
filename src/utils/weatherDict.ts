
export const iconNameDict: Record<string, string> = {
  '01d': '/svg/clear-sky.svg',
  '01n': '/svg/clear-sky.svg',
  '02d': '/svg/sunny.svg',
  '02n': '/svg/sunny.svg',
  '03d': '/svg/cloudy.svg',
  '03n': '/svg/cloudy.svg',
  '04d': '/svg/heavyCloud.svg',
  '04n': '/svg/heavyCloud.svg',
  '09d': '/svg/light-rain.svg',
  '09n': '/svg/light-rain.svg',
  '10d': '/svg/rain.svg',
  '10n': '/svg/rain.svg',
  '11d': '/svg/thunder.svg',
  '11n': '/svg/thunder.svg',
  '13d': '/svg/snow.svg',
  '13n': '/svg/snow.svg',
  '50d': '/svg/fog.svg',
  '50n': '/svg/fog.svg',
}

export const iconNameToEggDict: Record<string, string> = {
  '01d': '/obtain/egg-red.webp',
  '01n': '/obtain/egg-red.webp',
  '02d': '/obtain/egg-nomal.webp',
  '02n': '/obtain/egg-nomal.webp',
  '03d': '/obtain/egg-nomal.webp',
  '03n': '/obtain/egg-nomal.webp',
  '04d': '/obtain/egg-nomal.webp',
  '04n': '/obtain/egg-nomal.webp',
  '09d': '/obtain/egg-blue.webp',
  '09n': '/obtain/egg-blue.webp',
  '10d': '/obtain/egg-blue.webp',
  '10n': '/obtain/egg-blue.webp',
  '11d': '/obtain/egg-gold.webp',
  '11n': '/obtain/egg-gold.webp',
  '13d': '/obtain/egg-red.webp',
  '13n': '/obtain/egg-red.webp',
  '50d': '/obtain/egg-blue.webp',
  '50n': '/obtain/egg-blue.webp',
}

export const iconToFoodsMap: Record<string, string[]> = {
  plant: ['01d', '01n', '02d', '02n', '04d', '04n', '10d', '10n'],
  fruit: ['01d', '01n','09d', '09n'],
  frog: ['11d','11n'],
  insect: ['11d','11n'],
};

export const thunderIcons = ['11d', '11n'];

export const weekNameDict: Record<string, string> = {
  'Monday': '月曜日',
  'Tuesday': '火曜日',
  'Wednesday': '水曜日',
  'Thursday': '木曜日',
  'Friday': '金曜日',
  'Saturday': '土曜日',
  'Sunday': '日曜日',
}

export const shortWeekNameDict: Record<string, string> = {
  Monday: '月',
  Tuesday: '火',
  Wednesday: '水',
  Thursday: '木',
  Friday: '金',
  Saturday: '土',
  Sunday: '日',
};

export const removeZero = (date: Date) => {
  const month = date.getMonth() + 1; // 0-based → 1-based
  const day = date.getDate();
  return `${month}月${day}日`;
}