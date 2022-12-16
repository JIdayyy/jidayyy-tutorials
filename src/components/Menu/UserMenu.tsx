/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const { data } = useSession();

  return (
    <div className="w-[300px] flex flex-col right-0 z-[100] rounded-md bg-blue-400 border absolute text-white border-blue-600 divide-blue-600 divide-y">
      <span
        className="cursor-pointer hover:bg-blue-200 w-full px-2 py-1"
        onClick={() => signOut()}
      >
        Sign Out
      </span>
      <span className="cursor-pointer hover:bg-blue-200 w-full px-2 py-1">
        @{data?.user?.name}
      </span>
    </div>
  );
}
