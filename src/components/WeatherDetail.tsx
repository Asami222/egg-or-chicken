import { convertKelvinToCelsius } from "utils/convertKelvinToCelsius";
import {Container} from "./Container"
import WeatherIcon from "./WeatherIcon"
import { weekNameDict } from "utils/weatherDict";
import { cn } from "utils/cn"

export interface WeatherDetailProps {
  weatherIcon: string;
  date: string;
  week?: string;
  time?: string;
  temp: number;
  description: string;
}

const WeatherDetail = (props: WeatherDetailProps & React.HTMLProps<HTMLDivElement>) => {
  const {
    weatherIcon = "02d",
    date = "5月12日",
    week = "Tuesday",
    time,
    temp,
    description,
  } = props
  return (
    <Container className={cn("gap-4",props.className)}>
      <section className="w-full flex justify-between items-center px-6">
        <div className="flex flex-col gap-1 items-center text-sky-700">
          <p className="text-xl">{date}</p>
          <p className="text-sm">{weekNameDict[week]}</p>
          { time && <p className="text-sm">{time}</p> }
        </div>
        <div>
          <WeatherIcon iconname={weatherIcon} description={description}/>
        </div>
        <div className="flex flex-col text-teal-600 max-w-[72px] items-center">
          <span className="text-3xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs capitalize text-center">{description}</p>
        </div>
      </section>
    </Container>
  )
}

export default WeatherDetail