/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const postRouter = router({
  getAllPosts: publicProcedure
    .input(
      z
        .object({
          technologies: z.boolean(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        include: {
          technologies: !!input?.technologies,
        },
      });
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
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          published: input.published,
          description: input.description,
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

      axios.post("/api/revalidate", {
        secret: process.env.MY_SECRET_TOKEN,
        path: `/${newPost.id}`,
      });

      return newPost;
    }),
});
