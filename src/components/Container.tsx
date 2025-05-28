import { cn } from "utils/cn"

export const Container = (props:React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn("w-full bg-white rounded-2xl flex py-4", props.className)}
      />
  )
}

/*
export const Container = (props:React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn("w-full bg-white border rounded-xl flex py-4 shadow-sm", props.className)}
      />
  )
}
*/