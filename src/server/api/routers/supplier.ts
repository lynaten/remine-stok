import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const supplierRouter = createTRPCRouter({
  // ✅ Get all suppliers with related data
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.supplier.findMany({
      include: { EntityAddress: true, PurchaseOrder: true, Products: true },
    });
  }),

  // ✅ Get a single supplier by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.string() })) // Supplier ID is a string
    .query(async ({ ctx, input }) => {
      return await ctx.db.supplier.findUnique({
        where: { id: input.id },
        include: { EntityAddress: true, PurchaseOrder: true, Products: true },
      });
    }),

  // ✅ Create a new supplier
  create: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1), // Unique supplier code
        name: z.string().optional(),
        contactPerson: z.string().optional(),
        contactNo: z.string().max(20).optional(),
        email: z.string().email().optional(),
        npwp: z.string().optional(), // Tax Number
        termOfPayment: z.string().optional(),
        leadTime: z.number().int().positive().optional(), // Must be positive integer
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.create({
        data: {
          code: input.code,
          name: input.name,
          contactPerson: input.contactPerson,
          contactNo: input.contactNo,
          email: input.email,
          npwp: input.npwp,
          termOfPayment: input.termOfPayment,
          leadTime: input.leadTime,
        },
      });
    }),

  // ✅ Edit a supplier by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().optional(),
        name: z.string().optional(),
        contactPerson: z.string().optional(),
        contactNo: z.string().max(20).optional(),
        email: z.string().email().optional(),
        npwp: z.string().optional(),
        termOfPayment: z.string().optional(),
        leadTime: z.number().int().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.update({
        where: { id: input.id },
        data: {
          code: input.code,
          name: input.name,
          contactPerson: input.contactPerson,
          contactNo: input.contactNo,
          email: input.email,
          npwp: input.npwp,
          termOfPayment: input.termOfPayment,
          leadTime: input.leadTime,
        },
      });
    }),

  // ✅ Delete a supplier by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.delete({
        where: { id: input.id },
      });
    }),
});
