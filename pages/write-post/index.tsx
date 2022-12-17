/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Technology } from "@prisma/client";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../../src/components/Atoms/Input";
import Layout from "../../src/components/Layout/Layout";
import { NextPageWithLayout } from "../_app";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { trpc } from "../../src/utils/trpc";
import DEFAULT_VALUE from "../../src/constants/editor";
import { Code } from "../../src/components/Editor/utils";
import EditorSkeletton from "../../src/components/Skelettons/EditorSkeletton";
import MultiSelect, { Option } from "../../src/components/Atoms/MultiSelect";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeletton />,
  }
);

const getInitialValue = () => {
  const initialValue =
    typeof window !== "undefined" ? localStorage.getItem("draft") : "";
  if (initialValue) {
    return initialValue;
  }
  return DEFAULT_VALUE;
};

const WritePost: NextPageWithLayout = () => {
  const [value, setValue] = useState(() => getInitialValue());
  const { handleSubmit, register } = useForm();
  const [height, setHeight] = useState(500);
  const [selected, setSelected] = useState<Option[]>([]);
  const { data: categories } = trpc.category.getAllCategories.useQuery();
  const { data: technologies } = trpc.technology.getAllTechnologies.useQuery();

  const router = useRouter();
  const { data: sessionData } = useSession({
    onUnauthenticated: () => {
      router.push("/api/auth/signin");
    },
    required: true,
  });

  const { mutate, isLoading } = trpc.post.createPost.useMutation({
    onSuccess: (data) => {
      trpc.useContext().post.getAllPosts.invalidate();
      localStorage.setItem("draft", "");
      router.push(`/${data.id}`);
    },
  });

  const onSubmit = (data: FieldValues) => {
    const newPost = {
      title: data.title,
      content: value,
      authorId: sessionData?.user?.id as string,
      categoryId: data.categoryId,
      description: data.description,
      published: true,
      image: data.image,
      technologies: selected.map((tech) => tech.value),
    };

    mutate(newPost);
  };

  const handleChange = (text: string | undefined) => {
    if (text) {
      setValue(text);
      setTimeout(() => {
        localStorage.setItem("draft", text);
      }, 3000);
    }
  };

  const convertTechAsOption = useCallback(
    (item: Technology[]) => {
      return item.map((tech) => {
        return { label: tech.name, value: tech.id, icon: tech.icon };
      }) as Option[];
    },
    [technologies]
  );

  const options = convertTechAsOption(technologies || []);

  return (
    <div className="w-full min-h-screen flex flex-col space-y-5  max-w-7xl mb-20">
      <h1>Write a new post here</h1>

      <form className="grid  grid-cols-2 grid-rows-2 gap-4 ">
        <select {...register("categoryId")}>
          <option>Select a category</option>
          {categories?.map((category) => (
            <option value={category.id}>{category.name}</option>
          ))}
        </select>
        <MultiSelect values={selected} onChange={setSelected} data={options} />
        <Input
          variant="solid"
          className="solid"
          name="title"
          placeholder="Enter the title of this tutorial"
          type="text"
          options={{
            required: true,
          }}
          register={register}
        />
        <Input
          variant="solid"
          className="solid"
          name="description"
          placeholder="Enter a short description of this tutorial"
          type="text"
          options={{
            required: true,
          }}
          register={register}
        />
        <Input
          variant="solid"
          className="solid"
          name="image"
          placeholder="Please provide an image url"
          type="text"
          options={{
            required: true,
          }}
          register={register}
        />
      </form>

      <div className="w-full h-full justify-between flex">
        <Suspense fallback={<div className="bg-white">Loading</div>}>
          <MarkdownEditor
            onChange={handleChange}
            spellCheck="true"
            autoCorrect="true"
            autoCapitalize="true"
            height={height}
            onHeightChange={(number) => setHeight(number as number)}
            previewOptions={{
              components: {
                code: Code,
              },
            }}
            className="w-full"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              wordWrap: "break-word",
            }}
            value={value}
            preview="live"
          />
        </Suspense>
      </div>
      <div className="w-full space-x-2 justify-end flex">
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
