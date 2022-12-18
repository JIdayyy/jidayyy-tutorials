interface IProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function SearchBar({ search, setSearch }: IProps) {
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full solid max-w-[500px]"
      placeholder="Search a tutorial ..."
    />
  );
}
