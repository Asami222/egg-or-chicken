
export const iconNameDict: Record<string, string> = {
  '01d': '/svg/clear-sky.svg',
  '01n': '/svg/clear-sky.svg',
  '02d': '/svg/sunny.svg',
  '02n': '/svg/sunny.svg',
  '03d': '/svg/cloudy.svg',
  '03n': '/svg/cloudy.svg',
  '04d': '/svg/rain-cloud.svg',
  '04n': '/svg/rain-cloud.svg',
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