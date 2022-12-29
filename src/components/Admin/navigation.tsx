import { AiFillHome, AiOutlineComment } from "react-icons/ai";
import { FaPager } from "react-icons/fa";

const adminNavlinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: AiFillHome,
  },
  {
    label: "Posts",
    href: "/admin/posts",
    icon: FaPager,
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: AiOutlineComment,
  },
];

export default adminNavlinks;
