'use client';

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/svg/logo.svg"
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
    <header className="flex justify-center bg-[#EBF3FF] sticky top-0 left-0 z-50" role="banner">
      <div className="flex justify-between items-center w-[86%] py-4 max-w-sm">
        <h2 id="global-navigation" className="sr-only">
          グローバルナビゲーション
        </h2>
        <Link href="/">
            <h1 className="w-[80px] mx-auto max-w-sm">
              <Image
                quality="85"
                src={logo}
                alt="egg or chickenのホーム"
                sizes="18vw"
                style={{width: '100%', height: 'auto'}}
              />
            </h1>
          </Link>
        <nav aria-labelledby="global-navigation" role="navigation">
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