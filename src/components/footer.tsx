import Image from "next/image";
import logo from "../../public/svg/logo.svg"

const Footer = () => {
  return (
    <footer 
      className="sticky top-[100vh] pt-4 pb-8"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        フッター
      </h2>
      <p className="w-[113px] mx-auto max-w-sm">
        <Image
          quality="85"
          src={logo}
          alt="egg or chickenアプリのロゴ"
          sizes="29vw"
          style={{width: '100%', height: 'auto'}}
        />
      </p>
    </footer>
  )
}

export default Footer