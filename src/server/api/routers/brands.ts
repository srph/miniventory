import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const brandsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input }) => {
      const brands = await prisma.brand.findMany({
        where: input.search ? { name: input.search } : {},
      });

      return { brands };
    }),

  getDetailedList: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input }) => {
      const brands = await prisma.brand.findMany({
        where: input.search ? { name: input.search } : {},
        include: { items: true },
      });

      return { brands };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const brand = await prisma.brand.findUniqueOrThrow({
        where: { id: input.id },
      });

      return { brand };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const brand = await prisma.brand.create({
        data: {
          name: input.name,
        },
      });

      return { brand };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const brand = await prisma.brand.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return { brand };
    }),
});
