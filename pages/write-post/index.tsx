/* eslint-disable react/function-component-definition */
import dynamic from "next/dynamic";
import { RefObject, useRef, useState } from "react";
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

const WritePost: NextPageWithLayout = () => {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const { mutate, isLoading } = trpc.post.createPost.useMutation({
    onSuccess: () => {
      trpc.useContext().post.getAllPosts.invalidate();
    },
  });

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    mutate({
      title: "Express Typescript Prisma workshop MVC",
      content: value,
      authorId: "b4280871-033a-4752-9d48-b4c51c0b8524",
      categoryId: "098c5fc6-9718-46bc-a560-a8524c1d26e1",
      published: true,
    });
  };

  return (
    <div className="w-full h-[80vh] max-w-7xl">
      <h1>Write a new post here</h1>
      <div className="w-full h-full justify-between flex">
        <div
          ref={ref1}
          onScroll={() => getElementScrollPositionPercentage(ref1, ref2)}
          className="w-1/2 h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 scrollbar-thumb-rounded  overflow-y-scroll min-h-[800px]"
        >
          <MarkdownEditor
            onChange={(text) => setValue(text)}
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
          onClick={handleSubmit}
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
