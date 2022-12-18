/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { z } from "zod";
import { getBaseUrl } from "../../../utils/trpc";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  getAllPosts: publicProcedure
    .input(
      z.object({
        technologies: z.boolean().optional(),
        author: z.boolean().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const [posts, postsCount] = await ctx.prisma.$transaction([
        ctx.prisma.post.findMany({
          skip: input?.skip,
          take: input?.take,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            _count: true,
            technologies: !!input?.technologies,
            author: !!input?.author,
          },
        }),
        ctx.prisma.post.count(),
      ]);

      return { posts, postsCount, take: input?.take, skip: input?.skip };
    }),

  getPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
        technologies: z.boolean().optional(),
        author: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          technologies: !!input?.technologies,
          author: !!input?.author,
        },
      });

      return post;
    }),
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
        published: z.boolean(),
        authorId: z.string(),
        categoryId: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          published: input.published,
          description: input.description,
          image: input.image,
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
          technologies: {
            connect: input.technologies.map((id) => ({ id })),
          },
        },
      });

      axios
        .post(`${getBaseUrl()}/api/revalidate`, {
          secret: process.env.MY_SECRET_TOKEN,
          path: `/${post.id}`,
        })
        .then((res) => console.log("REVALIDATE", res.data));

      return post;
    }),
});
