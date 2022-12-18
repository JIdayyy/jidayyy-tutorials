/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../src/server/env/server.mjs";
import { prisma } from "../../../src/server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_SECRET,
      clientSecret: env.GOOGLE_ID,
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },

  // secret: process.env.AUTH_SECRET,
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  // },
  debug: true,
  // useSecureCookies: true,
};

export default NextAuth(authOptions);
