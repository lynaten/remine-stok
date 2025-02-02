import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const addressRouter = createTRPCRouter({
  // ✅ Get all addresses with related data
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.address.findMany({
      include: { EntityAddress: true },
    });
  }),

  // ✅ Get a single address by ID
  getOneById: publicProcedure
    .input(z.object({ id: z.string() })) // Address ID is a string
    .query(async ({ ctx, input }) => {
      return await ctx.db.address.findUnique({
        where: { id: input.id },
        include: { EntityAddress: true },
      });
    }),

  // ✅ Create a new address
  create: protectedProcedure
    .input(
      z.object({
        fullAddress: z.string().min(1), // Full address is required
        unitNumber: z.string().optional(),
        streetName: z.string().min(1),
        neighborhood: z.string().optional(),
        rt: z.string().optional(),
        rw: z.string().optional(),
        kelurahan: z.string().optional(),
        kecamatan: z.string().optional(),
        city: z.string().min(1),
        region: z.string().min(1),
        postalCode: z.string().optional(),
        country: z.string().min(1),
        additionalInfo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.address.create({
        data: {
          fullAddress: input.fullAddress,
          unitNumber: input.unitNumber,
          streetName: input.streetName,
          neighborhood: input.neighborhood,
          rt: input.rt,
          rw: input.rw,
          kelurahan: input.kelurahan,
          kecamatan: input.kecamatan,
          city: input.city,
          region: input.region,
          postalCode: input.postalCode,
          country: input.country,
          additionalInfo: input.additionalInfo,
        },
      });
    }),

  // ✅ Edit an address by ID
  editById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullAddress: z.string().optional(),
        unitNumber: z.string().optional(),
        streetName: z.string().optional(),
        neighborhood: z.string().optional(),
        rt: z.string().optional(),
        rw: z.string().optional(),
        kelurahan: z.string().optional(),
        kecamatan: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        additionalInfo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.address.update({
        where: { id: input.id },
        data: {
          fullAddress: input.fullAddress,
          unitNumber: input.unitNumber,
          streetName: input.streetName,
          neighborhood: input.neighborhood,
          rt: input.rt,
          rw: input.rw,
          kelurahan: input.kelurahan,
          kecamatan: input.kecamatan,
          city: input.city,
          region: input.region,
          postalCode: input.postalCode,
          country: input.country,
          additionalInfo: input.additionalInfo,
        },
      });
    }),

  // ✅ Delete an address by ID
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.address.delete({
        where: { id: input.id },
      });
    }),
});
