'use client';

import Image from "next/image";
import Link from "next/link";
import feedImg from "../../public/svg/feed.svg"
import howtoImg from "../../public/svg/howto.svg"
//import sunnyImg from "../../public/svg/sunny.svg"
import NavWeather from "./NavWeather";
import LogoutButton from "./LogoutButton"; 

// クライアント側のみで動かすため、動的 import（SSR無効）

const categories = [
  {
    href: "/food",
    src: feedImg,
    alt: "ごはんを与える"
  },
  {
    href: "/howto",
    src: howtoImg,
    alt: "使い方を見る"
  },
]

const Header = () => {

  return (
    <header className="flex justify-center bg-[#EBF3FF] sticky top-0 left-0 z-50">
      <div className="flex justify-end w-[86%] py-4 max-w-sm">
      <nav>
        <ul className="flex items-center gap-6">
          <li>
              <Link href="/weather">
                <NavWeather />
              </Link>
            </li>
          { categories.map((category,i) => (
            <li key={i}>
              <Link href={category.href}>
                <div className="relative w-[40px] h-[40px] hover:opacity-80">
                  <Image
                    quality="85"
                    src={category.src}
                    alt={category.alt}
                    sizes="10.3vw"
                    fill
                    style={{objectFit:"contain", objectPosition:'50% 50%'}}
                    priority
                  />
                </div>
              </Link>
            </li>
          ))}
          <li>
              <LogoutButton />
          </li>
        </ul>
      </nav>
      </div>
    </header>
  )
}

export default Header