import { createTRPCRouter } from "~/server/api/trpc";
import { customersRouter } from "~/server/api/routers/customers";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { transactionsRouter } from "~/server/api/routers/transactions";
import { brandsRouter } from "~/server/api/routers/brands";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  brands: customersRouter,
  inventory: inventoryRouter,
  transactions: transactionsRouter,
  brands: brandsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
