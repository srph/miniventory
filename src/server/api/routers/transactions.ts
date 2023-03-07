import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { prisma } from "~/server/db";

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const transactions = await prisma.transaction.findMany();
    return { transactions };
  }),

  createPurchaseOrder: protectedProcedure
    .input(
      z.object({
        customerId: z.string().optional(),
        note: z.string().optional(),
        items: z.array(
          z.object({
            itemId: z.string(),
            quantity: z.number().min(1),
            transactionPrice: z.number().min(1),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      // @FUTURE: Add unique validation for item id
      // @FUTURE: Add quantity validation
      // @FUTURE: Add order price validation
      const items = await prisma.item.findMany({
        where: {
          id: { in: input.items.map((item) => item.itemId) },
        },
      });

      if (items.length !== input.items.length) {
        throw new Error("Unable to find all provided items");
      }

      const order = await prisma.transactionPurchaseOrder.create({
        data: {
          code: "random-code",
          note: input.note,
          totalItems: input.items.length,
          totalQuantity: input.items.reduce((total, transactionItem) => {
            return total + transactionItem.quantity;
          }, 0),
          totalSales: input.items.reduce((total, transactionItem) => {
            return total + transactionItem.transactionPrice;
          }, 0),
          expectedProfit: input.items.reduce((total, transactionItem) => {
            const item = items.find((item) => {
              return item.id === transactionItem.itemId;
            });

            if (item == null) {
              throw new Error(`Unable to find item ${transactionItem.itemId}`);
            }

            return total + item.retailPrice - item.factoryPrice;
          }, 0),
          totalProfit: input.items.reduce((total, transactionItem) => {
            const item = items.find((item) => {
              return item.id === transactionItem.itemId;
            });

            if (item == null) {
              throw new Error(`Unable to find item ${transactionItem.itemId}`);
            }

            return total + transactionItem.transactionPrice - item.factoryPrice;
          }, 0),
          customer: {
            connect: { id: input.customerId },
          },
          items: {
            create: input.items.map((transactionItem) => {
              const item = items.find((item) => {
                return item.id === transactionItem.itemId;
              });

              if (item == null) {
                throw new Error(
                  `Unable to find item ${transactionItem.itemId}`
                );
              }

              return {
                item: {
                  connect: { id: transactionItem.itemId },
                },
                quantity: transactionItem.quantity,
                factoryPrice: item.factoryPrice,
                retailPrice: item.retailPrice,
                transactionPrice: transactionItem.transactionPrice,
              };
            }),
          },
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          type: "purchase",
          purchaseOrder: {
            connect: { id: order.id },
          },
        },
      });

      return { transaction };
    }),
});
