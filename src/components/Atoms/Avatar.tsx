import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import UserMenu from "../Menu/UserMenu";
import NavLink from "../Navbar/NavLink";

export default function Avatar() {
  const { status, data } = useSession();
  const [isMenu, setIsMenu] = useState(false);

  const toggleMenu = () => {
    setIsMenu((state) => !state);
  };

  return (
    <div className="relative">
      {status === "authenticated" ? (
        <Image
          onClick={toggleMenu}
          className="rounded-full w-10 h-10 cursor-pointer  border-blue-200 transition-all hover:border-2  ease-in-out duration-fast"
          src={data?.user?.image || ""}
          width={100}
          height={100}
          alt="avatar"
        />
      ) : (
        <NavLink link="/api/auth/signin" name="Sign In" />
      )}
      {isMenu && <UserMenu />}
    </div>
  );
}
