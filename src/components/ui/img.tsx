import Image from "next/image"
import { cn } from "utils/cn"


export const ImgBox = (props: React.HTMLProps<HTMLDivElement> & {src: string, description: string, sizes?: string, onClick?: () => void }) => {
  return (
    <div {...props} className={cn('relative',props.className)}>
      <Image
        quality="85"
        alt={props.description}
        fill
        sizes={props.sizes}
        style={{objectFit:"contain", objectPosition:'50% 50%'}}
        src={props.src}
        onClick={props.onClick}
        priority
      />
    </div>
  )
}