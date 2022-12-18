/* eslint-disable import/prefer-default-export */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = router({
  getAllCommentsByPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        author: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
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
        postId: z.string(),
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
              id: input.postId,
            },
          },
        },
      });
      return comment;
    }),
});
