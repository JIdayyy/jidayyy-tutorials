/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { z } from "zod";
import slugify from "slugify";
import { getBaseUrl } from "../../../utils/trpc";
import { router, publicProcedure, adminProcedure } from "../trpc";

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
            slug: true,
            content: true,
            authorId: true,
            description: true,
            categoryId: true,
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
        slug: z.string(),
        technologies: z.boolean().optional(),
        author: z.boolean().optional(),
        categories: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          slug: input.slug,
        },
        include: {
          technologies: !!input?.technologies,
          author: !!input?.author,
          category: !!input?.categories,
        },
      });

      return post;
    }),

  editPost: adminProcedure
    .input(
      z.object({
        id: z.string(),
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
      const post = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          title: input.title,
          slug: slugify(input.title, { lower: true, strict: true }),
          published: input.published,
          description: input.description,
          image: input.image,
          technologies: {
            set: input.technologies.map((id) => ({ id })),
          },
        },
      });

      axios
        .post(`${getBaseUrl()}/api/revalidate`, {
          secret: process.env.MY_SECRET_TOKEN,
          path: `/tutorial/${post.slug}`,
        })
        .then((res) => console.log("REVALIDATE", res.data));

      return post;
    }),

  createPost: adminProcedure
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
          slug: slugify(input.title, { lower: true, strict: true }),
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
          path: `/tutorial/${post.slug}`,
        })
        .then((res) => console.log("REVALIDATE", res.data));

      return post;
    }),
});
