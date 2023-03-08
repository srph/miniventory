import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const inventoryRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const items = await prisma.item.findMany({
        where: input.search ? { name: input.search } : {},
      });

      return { items };
    }),

  create: protectedProcedure
    .input(
      z.object({
        brandId: z.string(),
        name: z.string(),
        factoryPrice: z.number().min(1),
        retailPrice: z.number().min(1),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const item = await prisma.item.create({
        data: {
          name: input.name,
          quantity: 1,
          factoryPrice: input.factoryPrice,
          retailPrice: input.retailPrice,
          thumbnailUrl: input.thumbnailUrl,
          brand: {
            connect: { id: input.brandId },
          },
        },
      });

      return { customer: item };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        brandId: z.string(),
        name: z.string(),
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
          factoryPrice: input.factoryPrice,
          retailPrice: input.retailPrice,
          thumbnailUrl: input.thumbnailUrl,
          brand: {
            connect: { id: input.brandId },
          },
        },
      });

      return { customer: item };
    }),
});
