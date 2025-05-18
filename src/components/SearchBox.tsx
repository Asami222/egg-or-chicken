import { IoSearch } from "react-icons/io5"
import { cn } from "utils/cn";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

const SearchBox = (props: Props) => {
  return (
    <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10",props.className)}>
      <input 
        type="text"
        value={props.value} 
        placeholder="Search location.." 
        className="px-4 py-2 w-[230px] rounded-lg focus:outline-none focus:border-sky-700 h-full text-sky-700"
        onChange={props.onChange}
      />
      <button className="px-[8px] py-[4px] text-sky-700 focus:outline-none hover:text-sky-500 h-full text-xl">
        <IoSearch />
      </button>
    </form>
  )
}

export default SearchBox