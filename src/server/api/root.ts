import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { customersRouter } from "~/server/api/routers/customers";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { transactionsRouter } from "~/server/api/routers/transactions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  customers: customersRouter,
  inventory: inventoryRouter,
  transactions: transactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
