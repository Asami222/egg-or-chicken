import { ImgBox } from "components/ui/img";
import { IoIosMore } from "react-icons/io";
/*
type DataProps = {
  src: string
  alt: string
  count: number
  layout?: '7' | '8'
  className?: string
}

export const eggdata = [
  {
    src: '/obtain/egg-red.webp',
    alt: '赤い卵',
    count: 15
  },
  {
    src: '/obtain/egg-nomal.webp',
    alt: '白い卵',
    count: 4
  },
  {
    src: '/obtain/egg-blue.webp',
    alt: '青い卵',
    count: 5
  },
  {
    src: '/obtain/egg-gold.webp',
    alt: '金色の卵',
    count: 1
  },
  {
    src: '/obtain/wing-tate.webp',
    alt: '羽根',
    count: 10,
    layout: '7',
    className: 'w-[40px]'
  },
] satisfies DataProps[];
*/
const MAX_ICONS = 6;

interface RenderIconsProps {
  src: string | string[]
  alt: string
  count: number
  layout?: '7' | '8'
  className?: string
}

export const RenderIcons = ({src, alt, count, layout='8', className='w-[30px]'}: RenderIconsProps) => {

  const containerClass =
    layout === '8'
      ? "grid grid-cols-8 gap-2 items-center"
      : "grid grid-cols-7 gap-1 items-center";

  const MAX = alt === '羽根' ? MAX_ICONS : MAX_ICONS + 1
  const displayCount = Math.min(count, MAX);
  const showEllipsis = count > MAX;

  return (
  <div className={containerClass}>
    {
        Array.isArray(src)
          ? src.slice(0, MAX).map((img, i) => (
              <ImgBox key={i} src={img} description={alt} sizes="7.7vw" className={`h-[40px] w-[40px]`} />
            ))
          : Array.from({ length: displayCount }).map((_, i) => (
              <ImgBox key={i} src={src} description={alt} sizes="7.7vw" className={`h-[40px] ${className}`} />
            ))
      }
    {showEllipsis && <IoIosMore />}
  </div>
  )
};
