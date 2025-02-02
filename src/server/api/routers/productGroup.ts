import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const productGroupRouter = createTRPCRouter({
  // Get all product groups
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.productGroup.findMany({
      include: { Product: true },
    });
  }),

  // Get a single product group by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.number() })) // ProductGroup ID is a number
    .query(async ({ ctx, input }) => {
      const productGroup = await ctx.db.productGroup.findUnique({
        where: { id: input.id },
        include: { Product: true },
      });

      return productGroup ?? null;
    }),

  // Create a new product group
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const productGroup = await ctx.db.productGroup.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return { id: productGroup.id };
    }),

  // Edit a product group by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.productGroup.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  // Delete a product group by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.productGroup.delete({
        where: { id: input.id },
      });
    }),
});
