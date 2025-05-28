import React from "react";
import { cn } from "utils/cn"
import { Container } from "components/Container";
import { ImgBox } from "./ui/img";


// WeatherWrapper
type WeatherItem = {
  img?: string
  desc: string
}

type WrapperProps = {
  weather: WeatherItem[]
}

const WeatherWrapper = (props: React.HTMLProps<HTMLDivElement> & WrapperProps) => {
  return (
    <Container className={cn("items-center flex-col gap-4",props.className)}>
      { props.weather.map((item,i) => (
        <div className="flex gap-4 items-center" key={i}>
          { item.img && <ImgBox src={item.img} description={item.desc} sizes="10.3" className="h-[40px] w-[40px]"/> }
          <p className="text-sm font-semibold">{item.desc}</p>
        </div>
      ))}
    </Container>
  )
}


//DescWrapper
const DescWrapper = (props: React.HTMLProps<HTMLDivElement> & {desc: string}) => {
  return (
    <Container className={cn("justify-center text-left rounded-xl px-2",props.className)}>
      <p className="text-sm/6 font-semibold whitespace-pre-line">{props.desc}</p>
    </Container>
  )
}


// ImgDescWrapper
interface ImgDescWrapperProps {
  src: string
  desc: string
}

const ImgDescWrapper = (props: ImgDescWrapperProps) => {
  return (
    <div className="flex gap-4 items-center py-1 px-2">
      <ImgBox src={props.src} description={props.desc} sizes="14.1" className="h-[55px] w-[55px]"/>
      <p className="text-sm font-semibold">{props.desc}</p>
    </div>
  )
}


// ChangeKindWrapper
interface ChangeKindWrapperProps {
  src: string
  imgDesc: string
  desc: string
  bgColor: string
}

 export const ChangeKindWrapper = (props: ChangeKindWrapperProps) => {
  return (
  <div className="flex flex-col items-center gap-1">
    <ImgDescWrapper src={props.src} desc={props.imgDesc}/>
    <DescWrapper desc={props.desc} className={props.bgColor}/>
  </div>
  )
}


//WeatherKindWrapper & FoodAppearWrapper共通
interface KindWrapperProps {
  src: string
  imgDesc: string
  weather?: {img?: string, desc: string}[]
  weather1?: {img?: string, desc: string}[]
  desc?: string
  bgColor: string
}

// WeatherKindWrapper
export const WeatherKindWrapper = (props: KindWrapperProps) => {
  return (
  <div className="flex flex-col items-center gap-1">
    <ImgDescWrapper src={props.src} desc={props.imgDesc}/>
    { props.weather && <WeatherWrapper weather={props.weather} className={props.bgColor}/> }
    { props.desc && <DescWrapper desc={props.desc} className={props.bgColor}/> }
  </div>
  )
}

// FoodAppearWrapper
export const FoodAppearWrapper = (props: KindWrapperProps) => {
  return (
    <Container className="px-2 py-2 flex-col items-center gap-2 border border-dotted border-yellow-800">
      <ImgDescWrapper src={props.src} desc={props.imgDesc}/>
      { props.weather && <WeatherWrapper weather={props.weather} className={props.bgColor}/> }
      { props.weather1 &&
      <>
      <p className="font-semibold text-sm">または</p>
      <WeatherWrapper weather={props.weather1} className={props.bgColor}/>
      </>
      }
    </Container>
  )
}

// HowtoSection
type LayoutType = "list" | "grid"

interface HowtoSectionProps<T> {
  title: string;
  description?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  layout?: LayoutType;
  isLoading?: boolean;
  skeletonItem?: React.ReactNode; // optional placeholder
  skeletonCount?: number; // optional number of placeholders to show
}

export const HowtoSection = <T,>({ 
  title, 
  description, 
  items, 
  renderItem,
  layout = "list",
  isLoading = false,
  skeletonItem,
  skeletonCount = 3,
}: HowtoSectionProps<T>) => {
  const containerClass =
    layout === "grid"
      ? "flex justify-between mt-4"
      : "flex flex-col gap-8 mt-6 w-[78%] mx-auto";

  const displayedItems = isLoading
    ? Array.from({ length: skeletonCount })
    : items;
      
  return (
    <section className="text-center">
      <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 rounded mb-2">{title}</h2>
      {description && (
        <p className="text-sm/6 font-semibold mb-4 whitespace-pre-line">{description}</p>
      )}
      <div className={containerClass}>
        {displayedItems.map((item, i) =>
          isLoading && skeletonItem ? (
            <React.Fragment key={i}>{skeletonItem}</React.Fragment>
          ) : (
            renderItem(item as T, i)
          )
        )}
      </div>
    </section>
  );
};


{/**  MenuSection
interface MenuItem {
  src: string;
  desc: string;
}

interface MenuSectionProps {
  title: string;
  menuItems: MenuItem[];
}

export const MenuSection = ({ title, menuItems }: MenuSectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 text-center rounded">{title}</h2>
      <ul className="flex justify-between">
        {menuItems.map((menu, i) => (
          <li key={i} className="flex flex-col gap-4 items-center">
            <ImgBox
              src={menu.src}
              description={menu.desc}
              sizes="10.3vw"
              className="h-[40px] w-[40px]"
            />
            <p className="text-sm font-semibold">{menu.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
*/}