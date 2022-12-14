/* eslint-disable import/prefer-default-export */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const postRouter = router({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany();
    return posts;
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      return post;
    }),
  createPost: publicProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
        published: z.boolean(),
        authorId: z.string(),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          published: input.published,
          author: {
            connect: {
              id: input.authorId,
            },
          },
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });

      return newPost;
    }),
});
