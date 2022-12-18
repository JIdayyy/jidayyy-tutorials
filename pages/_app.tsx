/* eslint-disable @typescript-eslint/ban-types */
import { NextPage } from "next";
import type { AppProps, AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { ReactElement, ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { DefaultSeo } from "next-seo";
import "nprogress/nprogress.css";
import Router from "next/router";
import { Analytics } from "@vercel/analytics/react";
import NProgress from "nprogress";
import SEO from "../SEO/defaultConfig";
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

const App = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <DefaultSeo {...SEO} />
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
      <ToastContainer />
    </>
  );
}) as AppType;

export default trpc.withTRPC(App);
