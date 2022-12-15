/* eslint-disable import/prefer-default-export */
import { router, publicProcedure } from "../trpc";

export const categoryRouter = router({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();
    return categories;
  }),
});
