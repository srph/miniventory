import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { format } from "date-fns";
import BigNumber from "bignumber.js";

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async () => {
      const transactions = await prisma.transaction.findMany({
        include: {
          purchaseOrder: { include: { customer: true } },
          restockOrder: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      type Transaction = (typeof transactions)[number];

      interface GroupedTransactionItem {
        label: string;
        transactions: Transaction[];
      }

      const transactionByMonth = transactions.reduce(
        (object: Record<string, GroupedTransactionItem>, item) => {
          const date = format(new Date(item.createdAt), "MMMM yyyy");
          object[date] ??= { label: date, transactions: [] };
          object[date].transactions.push(item);
          return object;
        },
        {}
      );

      return { transactionsByMonth: Object.values(transactionByMonth) };
    }),

  getTransactionItems: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ input }) => {
      const transactionItems =
        await prisma.transactionPurchaseOrderItems.findMany({
          // @TODO: Restock
          where: { transactionPurchaseOrderId: input.transactionId },
          include: { item: true },
        });

      return { transactionItems: transactionItems };
    }),

  createPurchaseOrder: protectedProcedure
    .input(
      z.object({
        customerId: z.string().optional(),
        note: z.string().optional(),
        items: z
          .array(
            z.object({
              itemId: z.string(),
              quantity: z.number().min(1),
              transactionPrice: z.number().min(1),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ input }) => {
      // @FUTURE: Add order price validation
      const items = await prisma.item.findMany({
        where: {
          id: { in: input.items.map((item) => item.itemId) },
        },
      });

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
          totalExpectedProfit: clusteredItems.reduce((total, { item }) => {
            return total + item.retailPrice - item.factoryPrice;
          }, 0),
          totalProfit: clusteredItems.reduce((total, clusteredItem) => {
            const { item, transactionItem } = clusteredItem;
            return total + transactionItem.transactionPrice - item.factoryPrice;
          }, 0),
          ...(input.customerId
            ? { customer: { connect: { id: input.customerId } } }
            : {}),
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

      // Persist the updated quantities to the database
      for (const { item, transactionItem } of clusteredItems) {
        await prisma.item.update({
          where: { id: item.id },
          data: { quantity: item.quantity - transactionItem.quantity },
        });
      }

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

  createRestockOrder: protectedProcedure
    .input(
      z.object({
        note: z.string().optional(),
        shippingFee: z.number().optional(),
        items: z
          .array(
            z.object({
              itemId: z.string(),
              quantity: z.number().min(1),
              retailPrice: z.number().min(1),
              factoryPrice: z.number().min(1),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ input }) => {
      // @FUTURE: Add order price validation
      const items = await prisma.item.findMany({
        where: {
          id: { in: input.items.map((item) => item.itemId) },
        },
      });

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

      const order = await prisma.transactionRestockOrder.create({
        data: {
          code: `RESTOCK-${nanoid(10)}`,
          note: input.note,
          shippingFee: input.shippingFee,
          totalItems: input.items.length,
          totalQuantity: input.items.reduce((total, transactionItem) => {
            return total + transactionItem.quantity;
          }, 0),
          totalOriginalRevenue: clusteredItems.reduce((total, { item }) => {
            return total + item.retailPrice;
          }, 0),
          totalOriginalExpenses: clusteredItems.reduce((total, { item }) => {
            return total + item.factoryPrice;
          }, 0),
          totalRevenue: clusteredItems.reduce((total, { transactionItem }) => {
            return total + transactionItem.retailPrice;
          }, 0),
          totalExpenses: clusteredItems.reduce((total, { transactionItem }) => {
            return total + transactionItem.factoryPrice;
          }, 0),
          items: {
            create: clusteredItems.map(({ item, transactionItem }) => {
              return {
                item: {
                  connect: { id: transactionItem.itemId },
                },
                quantity: transactionItem.quantity,
                originalFactoryPrice: item.factoryPrice,
                originalRetailPrice: item.retailPrice,
                factoryPrice: transactionItem.factoryPrice,
                retailPrice: transactionItem.retailPrice,
              };
            }),
          },
        },
      });

      // Persist the increased quantities and updated prices to the database
      for (const { item, transactionItem } of clusteredItems) {
        await prisma.item.update({
          where: { id: item.id },
          data: {
            quantity: item.quantity + transactionItem.quantity,
            factoryPrice: transactionItem.factoryPrice,
            retailPrice: transactionItem.retailPrice,
          },
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          type: "purchase",
          restockOrder: {
            connect: { id: order.id },
          },
        },
      });

      return { transaction };
    }),
});
