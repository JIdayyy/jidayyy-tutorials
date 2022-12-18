import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./categoryRouter";
import { commentRouter } from "./commentRouter";
import { postRouter } from "./postRouter";
import { technologyRouter } from "./technologyRouter";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  auth: authRouter,
  post: postRouter,
  category: categoryRouter,
  technology: technologyRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
