/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import removeImports from "next-remove-imports";

const remove = removeImports();

!process.env.SKIP_ENV_VALIDATION &&
  (await import("./src/server/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = remove({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
});

export default config;
