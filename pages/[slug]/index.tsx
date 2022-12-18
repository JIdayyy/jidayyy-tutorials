/* eslint-disable react/function-component-definition */
/* eslint-disable import/prefer-default-export */
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import SuperJSON from "superjson";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import Layout from "../../src/components/Layout/Layout";
import { createContext } from "../../src/server/trpc/context";
import { appRouter } from "../../src/server/trpc/router/_app";
import { trpc } from "../../src/utils/trpc";
import { NextPageWithLayout } from "../_app";
import "@uiw/react-markdown-preview/markdown.css";
import { Code } from "../../src/components/Editor/utils";
import WaveSmall from "../../src/components/svgs/wavesmall";

const MarkdownEditorPreview = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

const PostDetails: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { data, isLoading, isError } = trpc.post.getPost.useQuery({
    id: query.slug as string,
  });

  if (isError || !data) return <div>404</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl w-full py-20">
      <div className="w-screen pointer-events-none absolute left-0 top-0">
        <Image
          src={data.image as string}
          width={1000}
          height={200}
          alt="post cover"
          className=" object-contain top-0 opacity-[0.02] bg-blend-darken selection:mix-blend-darken w-full z-0"
        />
        <WaveSmall className="absolute pointer-events-none h-[1200px] top-0  left-0 z-0 opacity-25 w-screen" />
      </div>
      <MarkdownEditorPreview
        className="w-full px-2  min-h-[500px] z-10  border-0 "
        source={data.content}
        components={{
          code: Code,
        }}
      />
    </div>
  );
};

PostDetails.getLayout = (page) => <Layout>{page}</Layout>;

export const getStaticPaths: GetStaticPaths = async () => {
  const ssg = createProxySSGHelpers({
    ctx: await createContext(),
    router: appRouter,
    transformer: SuperJSON,
  });

  const posts = await ssg.post.getAllPosts.fetch({});

  const paths = posts.posts.map((post) => ({
    params: { slug: post.id },
  }));

  return {
    paths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) return Promise.reject(new Error("No params found"));

  const { slug } = ctx.params;

  const ssg = createProxySSGHelpers({
    ctx: await createContext(),
    router: appRouter,
    transformer: SuperJSON,
  });

  await ssg.post.getPost.prefetch({ id: slug as string });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      revalidate: 10,
    },
  };
};

export default PostDetails;
