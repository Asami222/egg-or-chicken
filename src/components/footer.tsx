import Image from "next/image";
import logo from "../../public/svg/logo.svg"

const Footer = () => {
  return (
    <footer className="sticky top-[100vh] pt-4 pb-8">
      <div className="w-[113px] mx-auto max-w-sm">
        <Image
          quality="85"
          src={logo}
          alt="egg or chicken"
          sizes="29vw"
          style={{width: '100%', height: 'auto'}}
          priority
        />
      </div>
    </footer>
  )
}

export default Footer