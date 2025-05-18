"use client";

//import Image, { StaticImageData } from "next/image"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Container } from "components/Container"
//import plantImg from "../../../public/food/plant.webp"
//import frogImg from "../../../public/food/frog.webp"
//import insectImg from "../../../public/food/insect.webp"
//import fruitImg from "../../../public/food/fruit.webp"
import FoodCheckbox from "components/FoodCheckbox"
import { useState } from "react"
import { IoCloseOutline } from "react-icons/io5";
import { ImgBox } from "components/WeatherIcon";

const imgdata = [
  {
    src: '/food/plant.webp',
    alt: "植物",
    number: 20,
    exchange: '/food/fruit.webp',
  },
  {
    src: '/food/insect.webp',
    alt: "昆虫",
    number: 0,
  },
  {
    src: '/food/frog.webp',
    alt: "両生類",
    number: 5,
    exchange: '/food/insect.webp',
  },
  {
    src: '/food/fruit.webp',
    alt: "果実",
    number: 10,
    exchange: '/food/frog.webp',
  }
]


const Food = () => {

  const [selectedItem, setSelectedItem] = useState<null | typeof imgdata[0]>(null);

  function open(item: typeof imgdata[0]) {
    setSelectedItem(item);
  }

  function close() {
    setSelectedItem(null);
  }

  console.log(selectedItem)

  return (
    <div className='mx-auto flex flex-col gap-9 w-full pb-10 pt-6'>
      <section className='flex w-full flex-col gap-8'>
        <p className="text-sm text-sky-700 px-2 font-medium">
          天気予報を確認して当日朝9時までに適した食べ物を与えましょう！<br/>
          （天気予報は変わる可能性があるので注意しましょう）
        </p>
        <Container className="px-6 py-5">
          <ul className="grid grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-8 mx-auto">
          { imgdata.map((d,i) => (
            <li key={i} className="flex flex-col gap-2">
              <ImgBox src={d.src} description={d.alt} sizes="23.1vw" className="h-[90px] w-[90px] cursor-pointer hover:opacity-80" onClick={() => open(d)}/>
              <p className="text-xs text-center font-medium">{d.number}</p>
            </li>
          ))}
          </ul>
        </Container>
      </section>

      {/* ダイアログはループ外で一つだけ描画 */}
      {selectedItem && (
        <Dialog open={true} onClose={close} as="div" className="relative z-10 focus:outline-none">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-white p-6 border border-sky-100 data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <DialogTitle as="h3" className="font-semibold text-center text-slate-800">
                  {selectedItem.alt}
                </DialogTitle>
                    <div className="flex items-center gap-5 justify-center my-4">
                      <ImgBox src={selectedItem.src} description={selectedItem.alt} sizes="18vw" className="h-[70px] w-[70px]"/>
                      <p className="font-medium text-slate-800">{selectedItem.number}</p>
                    </div>
                  <FoodCheckbox imgexchange={selectedItem.exchange} imgdescription={selectedItem.alt} />
                    <div className="mt-4 flex justify-end">
                      <button onClick={close} className="flex gap-1 items-center cursor-pointer text-slate-600 hover:text-slate-800">
                        <IoCloseOutline />
                        <p className="text-sm">閉じる</p>
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>
            )}
    </div>
  )
}

export default Food