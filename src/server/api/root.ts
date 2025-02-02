import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "@/server/api/routers/product";
import { productGroupRouter } from "./routers/productGroup";
import { userRouter } from "./routers/user";
import { addressRouter } from "./routers/address";
import { productVariantRouter } from "./routers/productVariant";
import { supplierRouter } from "./routers/supplier";
import { warehouseRouter } from "./routers/warehouse";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  product: productRouter,
  user: userRouter,
  productGroup: productGroupRouter,
  address: addressRouter,
  productVariant: productVariantRouter,
  supplier: supplierRouter,
  warehouse: warehouseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
