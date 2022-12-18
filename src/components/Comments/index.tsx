import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import TextArea from "./TextArea";

export default function Comments() {
  const { query } = useRouter();

  const { data } = trpc.comment.getAllCommentsByPost.useQuery({
    postId: query.slug as string,
    author: true,
  });

  return (
    <div className="space-y-5 py-10 px-2">
      <p className="text-xl">{data?.length || 0} comments</p>
      <TextArea />
      <div className="w-full space-y-10 flex flex-col">
        {data?.map((comment) => (
          <div className="flex mt-5 space-y-2 flex-col w-full">
            <div className="flex">
              <Image
                className="rounded-full"
                src={comment.author.image}
                width={40}
                height={40}
                alt="author avatar"
              />
              <div className="ml-2 flex flex-col">
                <p>{comment.author.name}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
