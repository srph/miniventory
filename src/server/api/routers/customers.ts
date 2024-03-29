import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const customersRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input }) => {
      const customers = await prisma.customer.findMany({
        where: input.search ? { name: input.search } : {},
      });

      return { customers };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const customer = await prisma.customer.findUnique({
        where: { id: input.id },
      });

      return { customer };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email().optional().or(z.literal("")),
        note: z.string().optional(),
        phone: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const customer = await prisma.customer.create({
        data: {
          name: input.name,
          email: input.email,
          note: input.note,
          phone: input.phone,
          thumbnailUrl: input.thumbnailUrl,
        },
      });

      return { customer };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email().or(z.literal("")),
        note: z.string().optional(),
        phone: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input);

      const customer = await prisma.customer.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          note: input.note,
          phone: input.phone,
          thumbnailUrl: input.thumbnailUrl,
        },
      });

      console.log(customer);

      return { customer };
    }),
});
