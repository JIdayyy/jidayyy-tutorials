/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Category, Post, Technology, User } from "@prisma/client";
import SuperJSON from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../../../src/components/Atoms/Input";
import Layout from "../../../src/components/Layout/Layout";
import { NextPageWithLayout } from "../../_app";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { trpc } from "../../../src/utils/trpc";
import DEFAULT_VALUE from "../../../src/constants/editor";
import { Code } from "../../../src/components/Editor/utils";
import EditorSkeletton from "../../../src/components/Skelettons/EditorSkeletton";
import MultiSelect, { Option } from "../../../src/components/Atoms/MultiSelect";
import { createContext } from "../../../src/server/trpc/context";
import { appRouter } from "../../../src/server/trpc/router/_app";
import Spinner from "../../../src/components/MultiSelect/components/Spinner";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeletton />,
  }
);

type PostToEdit = Post & {
  category: Category;
  author: User;
  technologies: Technology[];
};

const WritePost: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ postString }) => {
  const post: PostToEdit = SuperJSON.parse(postString);
  const [value, setValue] = useState(post.content);
  const { handleSubmit, register, setValue: setFieldValue } = useForm();
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

  const { mutate, isLoading } = trpc.post.editPost.useMutation({
    onSuccess: () => {
      trpc.useContext().post.getAllPosts.invalidate();

      router.push(`/`);
    },
  });

  const onSubmit = (data: FieldValues) => {
    const newPost = {
      title: data.title,
      id: post.id,
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

  useEffect(() => {
    if (post.technologies) {
      setSelected(convertTechAsOption(post.technologies));
    }
    setFieldValue("categoryId", post.categoryId);
    setFieldValue("title", post.title);
    setFieldValue("description", post.description);
    setFieldValue("image", post.image);
  }, []);

  const options = convertTechAsOption(technologies || []);

  if (sessionData?.user?.role !== "ADMIN") {
    return <h1>Unauthorized</h1>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col space-y-5  max-w-7xl mb-20">
      <h1>Edit this post ✐</h1>

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

      <div
        data-color-mode="dark"
        className="w-full h-full justify-between flex"
      >
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
          className="bg-blue-50 flex justify-center items-center align-middle min-w-[100px] text-white  px-2 py-1 rounded-sm hover:bg-blue-200"
          onClick={handleSubmit(onSubmit)}
          type="button"
        >
          {isLoading ? <Spinner /> : "Edit"}
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { slug } = context.query;
  const ssg = createProxySSGHelpers({
    ctx: await createContext(),
    router: appRouter,
    transformer: SuperJSON,
  });

  const postString = SuperJSON.stringify(
    await ssg.post.getPost.fetch({
      slug: slug as string,
      categories: true,
      technologies: true,
    })
  );

  return {
    props: {
      postString,
    },
  };
};

WritePost.getLayout = (page) => <Layout>{page}</Layout>;

export default WritePost;
