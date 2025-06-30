import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(Tag)
    .output(Tag)
    .mutation(async ({ input, ctx }) => {
      const createdTag = await ctx.tagRepo.create(input);
      return createdTag;
    }),

  findTagsByCategory: protectedProcedure
    .input(z.object({ householdId: z.string(), category: Category }))
    .output(z.array(Tag))
    .query(async ({ input, ctx }) => {
      const tags = await ctx.tagRepo.getHouseholdTags(input.householdId);
      return tags.filter((tag) => tag.category == input.category);
    }),
});
