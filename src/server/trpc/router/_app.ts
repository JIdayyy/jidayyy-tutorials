import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./categoryRouter";
import { postRouter } from "./postRouter";
import { technologyRouter } from "./technologyRouter";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  category: categoryRouter,
  technology: technologyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
