import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "react-icons/ai";

export default function EditButton() {
  const { query, push } = useRouter();
  const { data } = useSession();

  if (data?.user?.role !== "ADMIN") return null;

  return (
    <button
      className="cursor-pointer flex items-center  space-x-2"
      type="button"
      onClick={() => push(`/tutorial/${query.slug}/edit`)}
    >
      <p>Edit this post</p> <AiOutlineEdit color="white" />
    </button>
  );
}
