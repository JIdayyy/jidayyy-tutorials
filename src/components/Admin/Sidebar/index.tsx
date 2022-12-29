import { RxHamburgerMenu } from "react-icons/rx";
import adminNavlinks from "../navigation";
import NavIcon from "./NavIcon";

export default function Sidebar() {
  return (
    <div className="min-w-[100px] py-20 flex flex-col justify-between align-middle items-center  fixed left-0 bg-blue-700 h-full">
      <div className="space-y-4">
        {adminNavlinks.map((link) => (
          <NavIcon link={link.href} icon={link.icon} />
        ))}
      </div>
      <button type="button" className="p-4 rounded-full hover:bg-blue-50">
        <RxHamburgerMenu color="white" className=" w-12" />
      </button>
    </div>
  );
}
