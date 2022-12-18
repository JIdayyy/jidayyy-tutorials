import { AiOutlineSearch } from "react-icons/ai";

interface IProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function SearchBar({ search, setSearch }: IProps) {
  return (
    <label className="relative flex" htmlFor="search">
      <AiOutlineSearch
        className="absolute w-5 h-5 translate-y-[50%] left-2"
        color="gray"
      />
      <input
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full   pl-10 text-white  outline-none focus:ring-0 ring-0  bg-opacity-10 bg-blue-800 h-10  rounded-sm px-4 py-1 border-b border-blue-200 max-w-[500px]"
        placeholder="Search a tutorial ..."
      />
    </label>
  );
}
