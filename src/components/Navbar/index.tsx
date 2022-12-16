import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavLink from "./NavLink";

const navLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    auth: false,
  },
  {
    id: 2,
    name: "Write Post",
    path: "/write-post",
    auth: true,
  },
];

export default function Navbar() {
  const { data, status } = useSession();

  return (
    <div className="max-w-7xl px-2   z-10 bg-[] text-white border-b-light border-gray-700 py-5 flex w-full items-center justify-between">
      <Link href="/">
        <p>Jidayy tutorials</p>
      </Link>
      <div className="space-x-8 items-center justify-center align-middle flex">
        {navLinks.map((link) => (
          <NavLink link={link.path} name={link.name} />
        ))}
        {status === "authenticated" ? (
          <Image
            className="rounded-full w-10 h-10 cursor-pointer  border-blue-200 transition-all hover:border-2  ease-in-out duration-fast"
            src={data?.user?.image || ""}
            width={100}
            height={100}
            alt="avatar"
          />
        ) : (
          <div className="w-10 h-10">
            <NavLink link="/api/auth/signin" name="Sign In" />
          </div>
        )}
      </div>
    </div>
  );
}
