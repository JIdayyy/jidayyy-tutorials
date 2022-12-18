/* eslint-disable react/function-component-definition */
import superjson from "superjson";
import { useMemo, useState } from "react";
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
import Spinner from "../src/components/MultiSelect/components/Spinner";
import PaginationControls from "../src/components/PaginationControls";

const PAGE_SIZE = 12;

const Home: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = trpc.post.getAllPosts.useQuery(
    { technologies: true },
    {
      networkMode: "offlineFirst",
    }
  );
  const { data: categories } = trpc.category.getAllCategories.useQuery();

  if (isLoading) return <Spinner />;

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return data?.posts.slice(firstPageIndex, lastPageIndex) || [];
  }, [currentPage]);

  return (
    <div className="w-full mb-20 flex justify-center items-center align-middle flex-col">
      <Header />

      <div className="max-w-7xl w-full flex flex-col  justify-center">
        <div className="w-full flex justify-end">
          <select className="ml-2 max-w-[300px]" name="" id="">
            {categories?.map((category) => (
              <option>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full px-2 mt-10 grid grid-col-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentTableData.map((post) => (
            <Link href={post.id}>
              <div className="border-blue-600 bg-blue-400 bg-opacity-40 flex flex-col rounded-sm justify-between  min-h-[220px] hover:border-blue-50 group  ease-in-out duration-normal  p-5 border-2">
                <div className="w-full flex flex-wrap space-x-2">
                  {post.technologies.map((technology) => (
                    <Image
                      alt="tech logo"
                      src={technology.icon}
                      width={50}
                      height={50}
                      className="w-10 rounded-md object-contain"
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
        <PaginationControls
          onPageChange={(page) => setCurrentPage(page)}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalCount={data?.postsCount || 0}
          pageItemsNumber={currentTableData.length}
        />
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

  await ssg.category.getAllCategories.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 10,
  };
};
