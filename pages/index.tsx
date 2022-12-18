/* eslint-disable react/function-component-definition */
import superjson from "superjson";
import { useMemo, useState } from "react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import { createContext } from "../src/server/trpc/context";
import Header from "../src/components/Header";
import Layout from "../src/components/Layout/Layout";
import { trpc } from "../src/utils/trpc";
import { NextPageWithLayout } from "./_app";
import { appRouter } from "../src/server/trpc/router/_app";
import Spinner from "../src/components/MultiSelect/components/Spinner";
import PaginationControls from "../src/components/PaginationControls";
import SearchBar from "../src/components/SearchBar";
import TutoCard from "../src/components/Cards/TutoCard";

const PAGE_SIZE = 24;

const Home: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
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
    return (
      data?.posts
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
        .slice(firstPageIndex, lastPageIndex) || []
    );
  }, [currentPage, search]);

  return (
    <div className="w-full mb-20 flex justify-center items-center align-middle flex-col">
      <Header />

      <div className="max-w-7xl w-full flex flex-col  justify-center">
        <div className="w-full flex justify-between px-2">
          <SearchBar search={search} setSearch={setSearch} />

          <select className="ml-2 max-w-[300px]" name="" id="">
            {categories?.map((category) => (
              <option>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full px-2 mt-10 grid min-h-[300px] grid-col-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentTableData.map((post) => (
            <TutoCard post={post} />
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
