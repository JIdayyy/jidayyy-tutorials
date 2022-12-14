import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  link: string;
  name: string;
}

export default function NavLink({ link, name }: IProps) {
  const router = useRouter();
  const isActive = router.pathname === link;

  return (
    <Link href={link}>
      <p style={{ textDecoration: isActive ? "underline" : "none" }}>{name}</p>
    </Link>
  );
}
