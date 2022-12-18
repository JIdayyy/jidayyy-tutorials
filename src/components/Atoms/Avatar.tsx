/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useRef, useState } from "react";
import UserMenu from "../Menu/UserMenu";
import NavLink from "../Navbar/NavLink";
import useOnClickOutside from "../../hooks/use-onclick-outside";

export default function Avatar() {
  const { status, data } = useSession();
  const [isMenu, setIsMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenu((state) => !state);
  };

  useOnClickOutside(ref, () => setIsMenu(false));

  return (
    <div className="relative border-l border-blue-50 pl-5">
      {status === "authenticated" ? (
        <div className="flex space-x-5 justify-center items-center align-middle">
          <p onClick={toggleMenu} className="cursor-pointer">
            {data.user?.name}
          </p>
          <Image
            onClick={toggleMenu}
            className="rounded-full w-5 h-5 cursor-pointer  border-blue-200 transition-all hover:border-2  ease-in-out duration-fast"
            src={data?.user?.image || ""}
            width={100}
            priority
            height={100}
            alt="avatar"
          />
          <FiLogOut className="cursor-pointer" onClick={() => signOut()} />
        </div>
      ) : (
        <NavLink link="/api/auth/signin" name="Sign In" />
      )}
      <AnimatePresence> {isMenu && <UserMenu ref={ref} />}</AnimatePresence>
    </div>
  );
}
