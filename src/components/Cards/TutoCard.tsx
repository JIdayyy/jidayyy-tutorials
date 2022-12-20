import { Post, Prisma, Technology } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  post: Post & {
    technologies: Technology[];
    _count: Prisma.PostCountOutputType;
  };
};

export default function TutoCard({ post }: Props) {
  return (
    <Link href={`/tutorial/${post.slug}`}>
      <div className="border-blue-600 bg-blue-400 bg-opacity-40 flex flex-col rounded-sm justify-between  min-h-[220px] hover:border-blue-50 group  ease-in-out duration-normal  p-5 border-2">
        <div className="w-full flex flex-wrap space-x-2">
          {post.technologies.map((technology) => (
            <Image
              key={technology.id}
              alt="tech logo"
              src={technology.icon}
              width={50}
              height={50}
              className="w-10 rounded-sm object-contain"
            />
          ))}
        </div>
        <p className="text-white line-clamp-2 transition-all ease-in-out duration-normal group-hover:text-blue-50 font-bold">
          {post.title}
        </p>
        <p className="line-clamp-3 group-hover:text-blue-100 ease-in-out duration-normal">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
