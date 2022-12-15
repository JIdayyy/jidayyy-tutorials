import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./categoryRouter";
import { postRouter } from "./postRouter";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
