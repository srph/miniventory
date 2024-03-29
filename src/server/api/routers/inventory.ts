import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const inventoryRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const filters = input.search ? { name: { contains: input.search } } : {};

      const items = await prisma.item.findMany({
        where: filters,
        include: { brand: true },
      });

      return { items };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        brandId: z.string(),
        factoryPrice: z.number().min(1),
        retailPrice: z.number().min(1),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const item = await prisma.item.create({
        data: {
          name: input.name,
          quantity: 0,
          factoryPrice: input.factoryPrice,
          retailPrice: input.retailPrice,
          thumbnailUrl: input.thumbnailUrl,
          brand: {
            connect: { id: input.brandId },
          },
        },
      });

      return { item };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const item = await prisma.item.findUnique({
        where: { id: input.id },
        include: { brand: true },
      });

      return { item };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        brandId: z.string(),
        name: z.string(),
        quantity: z.number(),
        factoryPrice: z.number().min(1),
        retailPrice: z.number().min(1),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const item = await prisma.item.update({
        where: { id: input.id },
        data: {
          name: input.name,
          quantity: input.quantity,
          factoryPrice: input.factoryPrice,
          retailPrice: input.retailPrice,
          thumbnailUrl: input.thumbnailUrl,
          brand: {
            connect: { id: input.brandId },
          },
        },
      });

      return { item };
    }),
});
