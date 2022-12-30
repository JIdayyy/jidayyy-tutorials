/* eslint-disable import/prefer-default-export */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = router({
  getAllCommentsByPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        author: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          post: {
            slug: input.slug,
          },
        },
        include: {
          author: !!input.author,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return comments;
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          post: {
            connect: {
              slug: input.slug,
            },
          },
        },
      });
      return comment;
    }),
});
