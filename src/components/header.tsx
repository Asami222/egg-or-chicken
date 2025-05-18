import Image from "next/image";
import Link from "next/link";
import { createClient } from "libs/supabase/server";
import { signOut } from "app/login/actions";
import feedImg from "../../public/svg/feed.svg"
import howtoImg from "../../public/svg/howto.svg"
//import sunnyImg from "../../public/svg/sunny.svg"
import loginImg from "../../public/svg/login.svg"
import logoutImg from "../../public/svg/logout.svg"
import NavWeather from "./NavWeather";


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

const Header = async() => {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            <form>
              <button formAction={signOut} className="relative w-[35px] h-[35px] align-middle hover:opacity-80">
                <Image
                  quality="85"
                  src={user ? loginImg : logoutImg}
                  alt="ログイン状況"
                  sizes="10.3vw"
                  fill
                  style={{objectFit:"contain", objectPosition:'50% 50%'}}
                  priority
                />
              </button>
            </form>
          </li>
        </ul>
      </nav>
      </div>
    </header>
  )
}

export default Header