/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { forwardRef } from "react";

const UserMenu = forwardRef<HTMLDivElement>((_, ref) => {
  const { data } = useSession();

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-[300px] translate-y-5 -translate-x-[30%] after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:rotate-180 after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-blue-400 flex flex-col  z-[100] rounded-md bg-blue-400 border absolute text-white border-blue-600 divide-blue-600 divide-y"
    >
      <span
        className="cursor-pointer hover:bg-blue-200 w-full px-2 py-1"
        onClick={() => signOut()}
      >
        Sign Out
      </span>
      <span className="cursor-pointer hover:bg-blue-200 w-full px-2 py-1">
        @{data?.user?.name}
      </span>
    </motion.div>
  );
});

export default UserMenu;
