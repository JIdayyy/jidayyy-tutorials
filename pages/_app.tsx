/* eslint-disable @typescript-eslint/ban-types */
import { NextPage } from "next";
import type { AppProps, AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../src/utils/trpc";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </>
  );
}) as AppType;

export default trpc.withTRPC(App);
