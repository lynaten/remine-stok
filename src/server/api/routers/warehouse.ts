import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const warehouseRouter = createTRPCRouter({
  // ✅ Get all warehouses with related data
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.warehouse.findMany({
      include: {
        Stock: true,
        EntityAddress: true,
        TransferOrderFrom: true,
        TransferOrderTo: true,
        AdjustmentOrder: true,
        PurchaseOrder: true,
      },
    });
  }),

  // ✅ Get a single warehouse by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.string() })) // Warehouse ID is a string
    .query(async ({ ctx, input }) => {
      return await ctx.db.warehouse.findUnique({
        where: { id: input.id },
        include: {
          Stock: true,
          EntityAddress: true,
          TransferOrderFrom: true,
          TransferOrderTo: true,
          AdjustmentOrder: true,
          PurchaseOrder: true,
        },
      });
    }),

  // ✅ Create a new warehouse
  create: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1), // Required & unique
        name: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.warehouse.create({
        data: {
          code: input.code,
          name: input.name,
        },
      });
    }),

  // ✅ Edit a warehouse by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.warehouse.update({
        where: { id: input.id },
        data: {
          code: input.code,
          name: input.name,
        },
      });
    }),

  // ✅ Delete a warehouse by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.warehouse.delete({
        where: { id: input.id },
      });
    }),
});
