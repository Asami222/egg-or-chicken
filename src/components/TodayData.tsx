
<section className='space-y-4'>
          <div className='space-y-2'>
            <h2 className='flex gap-1 text-2xl items-end'>
            {firstData?.dt_txt ? (
              <>
                <p>{format(parseISO(firstData.dt_txt), 'EEEE')}</p>
                <p className='text-lg'>({format(parseISO(firstData.dt_txt), 'dd.MM.yyyy')})</p>
              </>
            ) : (
              <div className="w-40 h-6 bg-gray-300 rounded animate-pulse"></div>
            )}
            </h2>
            <Container className='gap-10 px-6 items-center'>
              {/** temprature */}
              <div className='flex flex-col px-4'>
                <span className='text-5xl'>
                {convertKelvinToCelsius(firstData?.main.temp ?? 295.09)}°
                </span>
                <p className='text-xs space-x-1 whitespace-nowrap'>
                  <span>Feels like</span>
                  <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className='text-xs space-x-2'>
                  <span>
                  {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓{" "}
                  </span>
                  <span>
                  {" "}{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/** time and weather icon */}
              <div className='flex gap-16 overflow-x-auto w-full justify-between pr-3'>
                {data?.list.map((d,i) =>
                  <div 
                    key={i}
                    className='flex flex-col justify-between gap-2 items-center text-xs font-semibold'
                  >
                    <p className='whitespace-nowrap'>{format(parseISO(d.dt_txt),'h:mm a')}</p>
                    {/* <WeatherIcon iconname={d.weather[0].icon}/> */}
                    <WeatherIcon iconname={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}/>
                    <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                )}
              </div>
            </Container>
          </div>
          <div className='flex gap-4'>
            {/** left */}
            <Container className='w-fit justify-center flex-col px-4 items-center'>
              <p className='capitalize text-center '>{firstData?.weather[0].description}</p>
              <WeatherIcon iconname={getDayOrNightIcon(firstData?.weather[0].icon ?? "",firstData?.dt_txt ?? "")}/>
            </Container>
            <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
              <WeatherDetails 
                visability={metersToKilometers(firstData?.visibility ?? 10000)} 
                airPressure={`${firstData?.main.pressure}hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1746215245),'H:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1746264524),'H:mm')}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                />
            </Container>
            {/** right */}
          </div>
        </section>
      

