import Link from "next/link";
import { useSession } from "next-auth/react";
import NavLink from "./NavLink";
import Avatar from "../Atoms/Avatar";

const navLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    auth: false,
  },
];

export default function Navbar() {
  const { data } = useSession();

  return (
    <div className="max-w-7xl px-2 z-10 text-white border-b-light border-gray-700 py-5 flex w-full items-center align-middle justify-between">
      <Link href="/" className="flex">
        <span className="text-4xl mr-2 flex items-center align-middle justify-center flex-col">
          🚀
        </span>
        <p className="font-bold">
          Jidayy <br /> tutorials
        </p>
      </Link>
      <div className="space-x-8 items-center justify-center align-middle flex">
        {navLinks.map((link) => (
          <NavLink key={link.id} link={link.path} name={link.name} />
        ))}
        {data?.user?.role === "ADMIN" && (
          <NavLink link="/tutorial/new" name="New Tuto" />
        )}
        <Avatar />
      </div>
    </div>
  );
}
