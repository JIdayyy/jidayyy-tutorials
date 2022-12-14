/* eslint-disable @typescript-eslint/ban-types */
import { NextPage } from "next";
import type { AppProps, AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactElement, ReactNode } from "react";
import { trpc } from "../src/utils/trpc";

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

const App = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}) as AppType;

export default trpc.withTRPC(App);
