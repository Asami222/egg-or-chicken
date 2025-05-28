import { Container } from "components/Container";
import { contents, navMenu } from "data/howtocontents";
import { WeatherKindWrapper, ChangeKindWrapper, FoodAppearWrapper,HowtoSection } from "components/howtoDetail";
import { ImgBox } from "components/ui/img";

const Howto = () => {
  return (
    <Container className="pb-12 mt-6">
      <div className="flex flex-col items-center w-[88%] mx-auto">
        <h1 className="text-lg font-semibold mt-4 mb-8">あそびかた</h1>
        <div className="flex flex-col gap-10 w-full">
          <HowtoSection
            title="メニュー"
            layout="grid"
            items={navMenu}
            renderItem={(item, i) => (
              <li key={i} className="flex flex-col gap-4 items-center">
                <ImgBox src={item.src} description={item.desc} sizes="10.3vw" className="h-[40px] w-[40px]" />
                <p className="text-sm font-semibold">{item.desc}</p>
              </li>
            )}
            isLoading={false}
          />
          {/**
          <section className="flex flex-col gap-6">
            <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 text-center rounded">メニュー</h2>
            <ul className="flex justify-between">
              { navMenu.map((menu,i) => (
                <li key={i} className="flex flex-col gap-4 items-center">
                  <ImgBox src={menu.src} description={menu.desc} sizes="10.3vw" className="h-[40px] w-[40px]"/>
                  <p className="text-sm font-semibold">{menu.desc}</p>
                </li>
              ))}
            </ul>
          </section>
           */}
          {/**
          <section className="text-center">
              <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 rounded mb-2">天気の種類</h2>
              <p className="text-sm/6 font-semibold">天気の種類に応じて鳥に変化があります。<br/>当日朝9時の天気が基準となります。</p>
              <div className="flex flex-col gap-8 mt-6 w-[78%] mx-auto">
                { contents.weather.map((content,i) => (
                  <WeatherKindWrapper key={i} {...content}/>
                ))}
              </div>
          </section>
          <section className="text-center">
              <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 rounded">変化の種類</h2>
              <div className="flex flex-col gap-8 mt-6 w-[78%] mx-auto">
                { contents.change.map((content,i) => (
                  <ChangeKindWrapper 
                    key={i} {...content}/>
                ))}
              </div>
          </section>
          <section className="text-center">
              <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 rounded">ごはんの種類</h2>
              <div className="flex flex-col gap-8 mt-6 w-[78%] mx-auto">
                { contents.food.map((content,i) => (
                  <ChangeKindWrapper key={i} {...content}/>
                ))}
              </div>
          </section>
          <section className="text-center">
            <h2 className="px-4 py-2 w-full font-semibold bg-orange-100 rounded">ごはんができる時</h2>
            <div className="flex flex-col gap-8 mt-6 w-[78%] mx-auto">
              { contents.appear.map((content,i) => (
                <FoodAppearWrapper key={i} {...content}/>
              ))}
            </div>
          </section>
          */}
          <HowtoSection
            title="天気の種類"
            description="天気の種類に応じて鳥に変化があります。 当日朝9時の天気が基準となります。"
            items={contents.weather}
            layout="list"
            renderItem={(item, i) => <WeatherKindWrapper key={i} {...item} />}
          />

          <HowtoSection
            title="変化の種類"
            items={contents.change}
            layout="list"
            renderItem={(item, i) => <ChangeKindWrapper key={i} {...item} />}
          />

          <HowtoSection
            title="ごはんの種類"
            items={contents.food}
            layout="list"
            renderItem={(item, i) => <ChangeKindWrapper key={i} {...item} />}
          />

          <HowtoSection
            title="ごはんができる時"
            items={contents.appear}
            layout="list"
            renderItem={(item, i) => <FoodAppearWrapper key={i} {...item} />}
          />
        </div>
      </div>
    </Container>
  )
}

export default Howto