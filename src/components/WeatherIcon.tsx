import Image from "next/image"
import { cn } from "utils/cn"
import { iconNameDict } from "utils/weatherDict"

const WeatherIcon = (props: React.HTMLProps<HTMLDivElement> & {iconname: string, description: string}) => {
  return (
    <div {...props} className={cn('relative h-[80px] w-[80px]')}>
      <Image
        quality="85"
        alt={props.description}
        fill
        sizes="20.5vw"
        style={{objectFit:"contain", objectPosition:'50% 50%'}}
        src={iconNameDict[props.iconname]}
        priority
      />
    </div>
  )
}

export const NavIcon = (props: React.HTMLProps<HTMLDivElement> & {iconname: string, description: string}) => {
  return (
    <div {...props} className={cn('relative h-[40px] w-[40px] hover:opacity-80')}>
      <Image
        quality="85"
        alt={props.description}
        fill
        sizes="10.3vw"
        style={{objectFit:"contain", objectPosition:'50% 50%'}}
        src={iconNameDict[props.iconname]}
        priority
      />
    </div>
  )
}

export const ImgBox = (props: React.HTMLProps<HTMLDivElement> & {src: string, description: string, sizes?: string }) => {
  return (
    <div {...props} className={cn('relative',props.className)}>
      <Image
        quality="85"
        alt={props.description}
        fill
        sizes={props.sizes}
        style={{objectFit:"contain", objectPosition:'50% 50%'}}
        src={props.src}
        priority
      />
    </div>
  )
}
/*
const WeatherIcon = (props: React.HTMLProps<HTMLDivElement> & {iconname: string}) => {
  return (
    <div {...props} className={cn('relative h-20 w-20')}>
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}
      />
    </div>
  )
}
*/
export default WeatherIcon