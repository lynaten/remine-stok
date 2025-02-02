import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.product.findMany({
      include: { productGroup: true, ProductVariant: true },
    });
  }),

  // Get a single product by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { productGroup: true, ProductVariant: true },
      });

      return product ?? null;
    }),

  // Create a new product
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        productGroupId: z.number().optional(),
        variantKeys: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          productGroupId: input.productGroupId,
          VariantKeys: input.variantKeys ?? [],
        },
      });
      return { id: product.id };
    }),

  // Edit a product by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        productGroupId: z.number().optional(),
        variantKeys: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          productGroupId: input.productGroupId,
          VariantKeys: input.variantKeys,
        },
      });
    }),

  // Delete a product by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
