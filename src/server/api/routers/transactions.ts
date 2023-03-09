import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async () => {
      const transactions = await prisma.transaction.findMany({
        include: {
          purchaseOrder: { include: { customer: true } },
          restockOrder: true,
        },
      });

      return { transactions };
    }),

  getTransactionItems: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ input }) => {
      const transactionItems =
        await prisma.transactionPurchaseOrderItems.findMany({
          where: { id: input.transactionId },
          include: { item: true },
        });

      return { transactionItems };
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
    .mutation(async ({ input }) => {
      // @FUTURE: Add order price validation
      const items = await prisma.item.findMany({
        where: {
          id: { in: input.items.map((item) => item.itemId) },
        },
      });

      // Basic validation to ensure all items are found
      if (items.length !== input.items.length) {
        throw new Error("Unable to find all provided items");
      }

      // Map transaction items to their corresponding
      // database item to avoid multiple lookups
      const clusteredItems = input.items.map((transactionItem) => {
        const item = items.find((item) => {
          return item.id === transactionItem.itemId;
        });

        if (item == null) {
          throw new Error(`Unable to find item ${transactionItem.itemId}`);
        }

        return { item, transactionItem };
      });

      // Validate quantity before we proceed
      for (const { item, transactionItem } of clusteredItems) {
        if (item.quantity < transactionItem.quantity) {
          throw new Error(
            `Insufficient quantity for item ${transactionItem.itemId}`
          );
        }
      }

      // Persist the updated quantities to the database
      for (const { item, transactionItem } of clusteredItems) {
        await prisma.item.update({
          where: { id: item.id },
          data: { quantity: item.quantity - transactionItem.quantity },
        });
      }

      const order = await prisma.transactionPurchaseOrder.create({
        data: {
          code: `PURCHASE-${nanoid(10)}`,
          note: input.note,
          totalItems: input.items.length,
          totalQuantity: input.items.reduce((total, transactionItem) => {
            return total + transactionItem.quantity;
          }, 0),
          totalSales: clusteredItems.reduce((total, { transactionItem }) => {
            return total + transactionItem.transactionPrice;
          }, 0),
          expectedProfit: clusteredItems.reduce((total, { item }) => {
            return total + item.retailPrice - item.factoryPrice;
          }, 0),
          totalProfit: clusteredItems.reduce((total, clusteredItem) => {
            const { item, transactionItem } = clusteredItem;
            return total + transactionItem.transactionPrice - item.factoryPrice;
          }, 0),
          customer: {
            connect: { id: input.customerId },
          },
          items: {
            create: clusteredItems.map(({ item, transactionItem }) => {
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
