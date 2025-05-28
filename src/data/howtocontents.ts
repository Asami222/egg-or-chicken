export const navMenu = [
  {
    src: "/svg/clear-sky.svg",
    desc: "天気"
  },
  {
    src: "/svg/feed.svg",
    desc: "ごはん"
  },
  {
    src: "/svg/howto.svg",
    desc: "使い方"
  },
  {
    src: "/svg/login.svg",
    desc: "ログイン"
  },
]

export const contents = {
  weather: [
    {
      src: '/obtain/egg-red.webp',
      imgDesc: "赤い卵を産みます",
      weather: [{img: "/svg/clear-sky.svg", desc: "快晴"}],
      bgColor: "bg-red-50"
    },
    {
      src: '/obtain/egg-nomal.webp',
      imgDesc: "白い卵を産みます",
      weather: [{img: "/svg/sunny.svg", desc: "晴れ"},{img: "/svg/cloudy.svg", desc: "曇り"}],
      bgColor: "bg-stone-50"
    },
    {
      src: '/obtain/egg-blue.webp',
      imgDesc: "青い卵を産みます",
      weather: [{img: "/svg/light-rain.svg", desc: "小雨"},{img: "/svg/rain.svg", desc: "雨"}],
      bgColor: "bg-cyan-50"
    },
    {
      src: '/obtain/wing-tate.webp',
      imgDesc: "羽が落ちます",
      desc: "天気に関係なく毎日",
      bgColor: "bg-sky-50"
    },
    {
      src: '/obtain/egg-gold.webp',
      imgDesc: "金の卵を産みます",
      weather: [{img: "/svg/thunder.svg", desc: "雷雨"}],
      bgColor: "bg-amber-50"
    },
    {
      src: '/obtain/egg-black.webp',
      imgDesc: "黒い卵を産みます",
      desc: "アプリに５日程度訪れない時",
      bgColor: "bg-slate-50"
    },
  ],
  change: [
    {
      src: '/obtain/egg-red.webp',
      imgDesc: "赤い卵",
      desc: "30個で金の卵になります",
      bgColor: "bg-red-50"
    },
    {
      src: '/obtain/egg-nomal.webp',
      imgDesc: "白い卵",
      desc: "20個で赤い卵になります",
      bgColor: "bg-stone-50"
    },
    {
      src: '/obtain/egg-blue.webp',
      imgDesc: "青い卵",
      desc: "15個で金の卵になります",
      bgColor: "bg-cyan-50"
    },
    {
      src: '/obtain/wing-tate.webp',
      imgDesc: "羽",
      desc: "10枚で鳥が肉になります",
      bgColor: "bg-sky-50"
    },
    {
      src: '/obtain/egg-gold.webp',
      imgDesc: "金の卵",
      desc: "1個で肉が鳥になります。\n20個で雛が生まれます",
      bgColor: "bg-amber-50"
    },
    {
      src: '/obtain/egg-black.webp',
      imgDesc: "黒い卵",
      desc: "3個で鳥が肉になります",
      bgColor: "bg-slate-50"
    },
  ],
  food: [
    {
      src: '/food/plant.webp',
      imgDesc: "植物",
      desc: "与えると回数分羽根が落ちません",
      bgColor: "bg-green-50"
    },
    {
      src: '/food/fruit.webp',
      imgDesc: "果実",
      desc: "どんな天気でも次の日に赤い卵を産みます",
      bgColor: "bg-red-50"
    },
    {
      src: '/food/frog.webp',
      imgDesc: "両生類",
      desc: "獲得した羽根が１枚消えます",
      bgColor: "bg-cyan-50"
    },
    {
      src: '/food/insect.webp',
      imgDesc: "昆虫",
      desc: "次の日に赤い卵10個産みます",
      bgColor: "bg-fuchsia-50"
    },
  ],
  appear: [
    {
      src: '/food/plant.webp',
      imgDesc: "植物",
      weather: [
        {img: "/svg/clear-sky.svg", desc: "快晴の日"},
        {img: "/svg/sunny.svg", desc: "晴れの日"},
        {img: "/svg/light-rain.svg",desc: "小雨の日"},
        {img: "/svg/rain.svg", desc: "雨の日"},
      ],
      bgColor: "bg-green-50"
    },
    {
      src: '/food/fruit.webp',
      imgDesc: "果実",
      weather: [{desc: "植物5個と交換"}],
      weather1: [
        {img: "/svg/sunny.svg", desc: "晴れの日"},
        {img: "/svg/light-rain.svg",desc: "小雨の日"},
        {desc: "を5日ずつ"},
      ],
      bgColor: "bg-red-50"
    },
    {
      src: '/food/frog.webp',
      imgDesc: "両生類",
      weather: [{desc: "果実10個と交換"}],
      weather1: [{desc: "雷雨の日に発生するかも？"}],
      bgColor: "bg-cyan-50"
    },
    {
      src: '/food/insect.webp',
      imgDesc: "昆虫",
      weather: [{desc: "両生類20匹と交換"}],
      weather1: [{desc: "雷雨の日に発生するかも？"}],
      bgColor: "bg-fuchsia-50"
    },
  ],
}