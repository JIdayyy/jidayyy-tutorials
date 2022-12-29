import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface IProps {
  link: string;
  icon: IconType;
}

export default function NavIcon({ icon, link }: IProps) {
  const Icon = icon;

  return (
    <Link
      className=" flex rounded-full hover:bg-blue-50 p-2 items-center align-middle"
      href={link}
    >
      <Icon color="white" className="w-12" />
    </Link>
  );
}
