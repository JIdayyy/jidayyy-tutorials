/* eslint-disable react/function-component-definition */
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import Link from "next/link";
import { createContext } from "../src/server/trpc/context";
import Header from "../src/components/Header";
import Layout from "../src/components/Layout/Layout";
import { trpc } from "../src/utils/trpc";
import { NextPageWithLayout } from "./_app";
import { appRouter } from "../src/server/trpc/router/_app";

const Home: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.post.getAllPosts.useQuery(undefined, {
    networkMode: "offlineFirst",
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-7xl">
      <Header />
      <div className="w-full mt-10 grid grid-cols-4 gap-4">
        {data?.map((post) => (
          <Link href={post.id}>
            <div className="border-gray-700 flex flex-col justify-between h-44 hover:border-blue-50 group  transition-all  p-5 border-light">
              <p className="text-white line-clamp-2 transition-all group-hover:text-blue-50 font-bold">
                {post.title}
              </p>
              <p className="line-clamp-3">
                Dans ce tutoriel je vous propose de découvrir comment construire
                un serveur http NodeJS avec Express et l&apos;ORM Prisma
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    ctx: await createContext(),
    router: appRouter,
    transformer: superjson,
  });

  await ssg.post.getAllPosts.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
