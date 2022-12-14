/* eslint-disable react/function-component-definition */
/* eslint-disable import/prefer-default-export */
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import SuperJSON from "superjson";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Layout from "../../src/components/Layout/Layout";
import { createContext } from "../../src/server/trpc/context";
import { appRouter } from "../../src/server/trpc/router/_app";
import { trpc } from "../../src/utils/trpc";
import { NextPageWithLayout } from "../_app";

import "@uiw/react-markdown-preview/markdown.css";
import WaveSvg from "../../src/components/svgs/wave";
import WaveSmall from "../../src/components/svgs/wavesmall";

const MarkdownEditorPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  {
    ssr: false,
  }
);

const PostDetails: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { data, isLoading, isError } = trpc.post.getPost.useQuery({
    id: query.slug as string,
  });

  if (isError || !data) return <div>404</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl my-20">
      <WaveSvg className="absolute top-0  left-0 z-0 opacity-25 w-screen" />
      <MarkdownEditorPreview
        style={{
          position: "relative",
          zIndex: 10,
          backgroundColor: "transparent",
          border: 0,
        }}
        className=""
        source={data.content}
      />
      <WaveSmall className="rotate-180 absolute bottom-0   left-0  opacity-25 w-screen" />
    </div>
  );
};

PostDetails.getLayout = (page) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.query;
  const ssg = createProxySSGHelpers({
    ctx: await createContext(),
    router: appRouter,
    transformer: SuperJSON,
  });

  await ssg.post.getPost.prefetch({ id: slug as string });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default PostDetails;
