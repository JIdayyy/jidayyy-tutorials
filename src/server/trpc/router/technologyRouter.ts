/* eslint-disable import/prefer-default-export */
import { router, publicProcedure } from "../trpc";

export const technologyRouter = router({
  getAllTechnologies: publicProcedure.query(async ({ ctx }) => {
    const technologies = await ctx.prisma.technology.findMany();
    return technologies;
  }),
});
