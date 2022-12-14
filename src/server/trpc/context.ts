import { type inferAsyncReturnType } from "@trpc/server";
// import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import * as trpcNext from "@trpc/server/adapters/next";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 * */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 * */
export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  if (!opts) {
    // this is for `getStaticProps()`
    return createContextInner({
      session: null,
    });
  }

  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createContextInner({
    session,
  });
};

// create context based of incoming request
// set as optional here so it can also be re-used for `getStaticProps()`
// export const createContext = async (
//   opts?: trpcNext.CreateNextContextOptions
// ) => {
//   return {
//     req: opts?.req,
//     prisma,
//   };
// };
// export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export type Context = inferAsyncReturnType<typeof createContext>;
