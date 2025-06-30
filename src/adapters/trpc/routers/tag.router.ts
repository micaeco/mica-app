import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";
import { Repositories } from "@domain/services/unit-of-work";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(Tag)
    .output(Tag)
    .mutation(async ({ input, ctx }) => {
      if (await ctx.tagRepo.exists(input.householdId, input.category, input.name)) {
        throw new Error("Tag already exists");
      }
      const createdTag = await ctx.tagRepo.create(input);
      return createdTag;
    }),

  getTagsByCategory: protectedProcedure
    .input(z.object({ householdId: z.string(), category: Category }))
    .output(z.array(Tag))
    .query(async ({ input, ctx }) => {
      const tags = await ctx.tagRepo.getTagsByCategory(input.householdId, input.category);
      return tags;
    }),

  update: protectedProcedure
    .input(Tag)
    .output(Tag)
    .mutation(async ({ input, ctx }) => {
      const updatedTag = await ctx.unitOfWork.execute(async (repos: Repositories) => {
        const tag = await repos.tagRepo.update(input);

        await ctx.eventRepo.deleteByTag(input.householdId, input.category, input.name);

        return tag;
      });

      return updatedTag;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {
      const deleted = await ctx.tagRepo.delete(input.id);
      return deleted;
    }),
});
