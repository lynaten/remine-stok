import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const productVariantRouter = createTRPCRouter({
  // ✅ Get all product variants with related data
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.productVariant.findMany({
      include: {
        product: true,
        VariantAttributes: true,
        Stock: true,
        OrderItem: true,
        Supplier: true,
      },
    });
  }),

  getByProductId: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.productVariant.findMany({
        where: { productId: input.productId },
        include: {
          VariantAttributes: true,
          Stock: true,
          OrderItem: true,
          Supplier: true,
        },
      });
    }),

  // ✅ Get a single product variant by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.string() })) // ProductVariant ID is a string
    .query(async ({ ctx, input }) => {
      return await ctx.db.productVariant.findUnique({
        where: { id: input.id },
        include: {
          product: true,
          VariantAttributes: true,
          Stock: true,
          OrderItem: true,
          Supplier: true,
        },
      });
    }),

  // ✅ Create a new product variant
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        sku: z.string().min(1), // SKU must be unique
        cost: z.number().min(0).default(0), // Cost must be non-negative
        price: z.number().min(0).default(0), // Price must be non-negative
        shelfLife: z.number().int().positive().optional(), // Shelf life in days (optional)
        supplierId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.productVariant.create({
        data: {
          productId: input.productId,
          sku: input.sku,
          cost: input.cost,
          price: input.price,
          shelfLife: input.shelfLife,
          supplierId: input.supplierId,
        },
      });
    }),

  // ✅ Edit a product variant by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        productId: z.string().optional(),
        sku: z.string().optional(),
        cost: z.number().min(0).optional(),
        price: z.number().min(0).optional(),
        shelfLife: z.number().int().positive().optional(),
        supplierId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.productVariant.update({
        where: { id: input.id },
        data: {
          productId: input.productId,
          sku: input.sku,
          cost: input.cost,
          price: input.price,
          shelfLife: input.shelfLife,
          supplierId: input.supplierId,
        },
      });
    }),

  // ✅ Delete a product variant by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.productVariant.delete({
        where: { id: input.id },
      });
    }),
});
