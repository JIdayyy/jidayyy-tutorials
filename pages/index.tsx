/* eslint-disable react/function-component-definition */
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { createContext } from "../src/server/trpc/context";
import Header from "../src/components/Header";
import Layout from "../src/components/Layout/Layout";
import { trpc } from "../src/utils/trpc";
import { NextPageWithLayout } from "./_app";
import { appRouter } from "../src/server/trpc/router/_app";

const Home: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.post.getAllPosts.useQuery(
    { technologies: true },
    {
      networkMode: "offlineFirst",
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full flex justify-center items-center align-middle flex-col">
      <Header />

      <div className="max-w-7xl  flex flex-col  justify-center">
        <div className="w-full px-2 mt-10 grid grid-col-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.map((post) => (
            <Link href={post.id}>
              <div className="border-blue-600 bg-blue-400 bg-opacity-40 flex flex-col justify-between  min-h-[220px] hover:border-blue-50 group  ease-in-out duration-normal  p-5 border-2">
                <div className="w-full flex flex-wrap space-x-2">
                  {post.technologies.map((technology) => (
                    <Image
                      alt="tech logo"
                      src={technology.icon}
                      width={50}
                      height={50}
                      className="w-10 object-contain"
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
          ))}
        </div>
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

  await ssg.post.getAllPosts.prefetch({
    technologies: true,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 10,
  };
};
