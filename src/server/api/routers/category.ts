import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().min(1, "Description is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;

      // Store the category in the database
      const category = await ctx.db.category.create({
        data: {
          name,
          description,
        },
      });

      return category;
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    const categoryList = await ctx.db.category.findMany({});
    return categoryList ?? null;
  }),
});
