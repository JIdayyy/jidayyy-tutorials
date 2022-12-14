import Link from "next/link";
import NavLink from "./NavLink";

const navLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
  },
  {
    id: 2,
    name: "Write Post",
    path: "/write-post",
  },
];

export default function Navbar() {
  return (
    <div className="max-w-7xl px-2   z-10 bg-[] text-white border-b-light border-gray-700 py-5 flex w-full items-center justify-between">
      <Link href="/">
        <p>Jidayy tutorials</p>
      </Link>
      <div className="space-x-8 flex">
        {navLinks.map((link) => (
          <NavLink link={link.path} name={link.name} />
        ))}
      </div>
    </div>
  );
}
