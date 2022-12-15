/* eslint-disable react/function-component-definition */
import dynamic from "next/dynamic";
import { RefObject, useRef, useState } from "react";
import { useRouter } from "next/router";
import rehypeSanitize from "rehype-sanitize";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../../src/components/Layout/Layout";
import { NextPageWithLayout } from "../_app";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { trpc } from "../../src/utils/trpc";
import DEFAULT_VALUE from "../../src/constants/editor";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const MarkdownEditorPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  {
    ssr: false,
  }
);

const setScrollPosition = (
  elementRef: RefObject<HTMLDivElement>,
  percentage: number
) => {
  const element = elementRef.current;
  if (element) {
    const { scrollHeight, clientHeight } = element;
    const scrollTop = (scrollHeight - clientHeight) * (percentage / 100);
    element.scrollTo(0, scrollTop);
  }
};

const getElementScrollPositionPercentage = (
  elementRef: RefObject<HTMLDivElement>,
  toElementRef: RefObject<HTMLDivElement>
) => {
  const element = elementRef.current;
  if (element) {
    const { scrollTop, scrollHeight, clientHeight } = element;
    const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollPosition(toElementRef, percentage);
  }
};

const getInitialValue = () => {
  const initialValue =
    typeof window !== "undefined" ? localStorage.getItem("draft") : "";
  if (initialValue) {
    return initialValue;
  }
  return DEFAULT_VALUE;
};

type FormData = {
  title: string;
  description: string;
  image: string;
  categoryId: string;
};

const WritePost: NextPageWithLayout = () => {
  const [value, setValue] = useState(() => getInitialValue());
  const { handleSubmit, register } = useForm<FormData>();
  const { data: categories } = trpc.category.getAllCategories.useQuery();

  const router = useRouter();
  const { data: sessionData } = useSession({
    onUnauthenticated: () => {
      router.push("/api/auth/signin");
    },
    required: true,
  });

  const { mutate, isLoading } = trpc.post.createPost.useMutation({
    onSuccess: () => {
      trpc.useContext().post.getAllPosts.invalidate();
      localStorage.setItem("draft", "");
    },
  });

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const onSubmit = (data: FormData) => {
    mutate({
      title: data.title,
      content: value,
      authorId: sessionData?.user?.id as string,
      categoryId: data.categoryId,
      description: data.description,
      published: true,
    });
  };

  const handleChange = (text: string) => {
    setValue(text);
    setTimeout(() => {
      localStorage.setItem("draft", text);
    }, 3000);
  };

  return (
    <div className="w-full h-[80vh] max-w-7xl">
      <h1>Write a new post here</h1>

      <form className="grid my-5 grid-cols-2 grid-rows-2 gap-4 ">
        <select {...register("categoryId")}>
          <option>Select a category</option>
          {categories?.map((category) => (
            <option value={category.id}>{category.name}</option>
          ))}
        </select>
        <input
          placeholder="Enter the title of this tutorial"
          type="text"
          {...register("title")}
        />
        <input
          placeholder="Enter a rapid description of this tuto"
          type="text"
          {...register("description")}
        />
        <input
          placeholder="Please provide an image url"
          type="text"
          {...register("image")}
        />
      </form>

      <div className="w-full h-full justify-between flex">
        <div
          ref={ref1}
          onScroll={() => getElementScrollPositionPercentage(ref1, ref2)}
          className="w-1/2 h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 scrollbar-thumb-rounded  overflow-y-scroll min-h-[800px]"
        >
          <MarkdownEditor
            onChange={handleChange}
            style={{
              minHeight: "800px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              wordWrap: "break-word",
            }}
            draggable
            value={value}
            enableScroll={false}
          />
        </div>
        <div
          ref={ref2}
          // onScroll={() => getElementScrollPositionPercentage(ref2, ref1)}
          className="w-1/2  h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 scrollbar-thumb-rounded overflow-y-scroll min-h-[800px]"
        >
          <MarkdownEditorPreview
            rehypePlugins={[rehypeSanitize]}
            linkTarget="_blank"
            source={value}
            style={{ width: "100%", minHeight: "800px", padding: "10px" }}
          />
        </div>
      </div>
      <div className="w-full space-x-2 justify-end flex px-10">
        <button
          onClick={() => setValue(DEFAULT_VALUE)}
          type="button"
          className="bg-red-500  hover:bg-red-500 px-2 py-1 text-white rounded-sm"
        >
          Reset
        </button>
        <button
          className="bg-blue-50 text-white  px-2 py-1 rounded-sm hover:bg-blue-200"
          onClick={handleSubmit(onSubmit)}
          type="button"
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

WritePost.getLayout = (page) => <Layout>{page}</Layout>;

export default WritePost;
