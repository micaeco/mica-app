import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { TagAlreadyExistsError, TagNotFoundError } from "@domain/entities/errors";
import { createTag, Tag } from "@domain/entities/tag";
import { Repositories } from "@domain/services/unit-of-work";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTag)
    .output(Tag)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (await ctx.tagRepo.exists(input.householdId, input.category, input.name)) {
        throw new TagAlreadyExistsError();
      }

      const createdTag = await ctx.tagRepo.create(input);
      return createdTag;
    }),

  getTagsByCategory: protectedProcedure
    .input(z.object({ householdId: z.string(), category: Category }))
    .output(z.array(Tag))
    .query(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const tags = await ctx.tagRepo.getTagsByCategory(input.householdId, input.category);
      return tags;
    }),

  update: protectedProcedure
    .input(Tag.extend({ newName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (await ctx.tagRepo.exists(input.householdId, input.category, input.newName)) {
        throw new TagAlreadyExistsError();
      }

      const updatedTag = await ctx.unitOfWork.execute(async (repos: Repositories) => {
        await repos.tagRepo.update({
          id: input.id,
          householdId: input.householdId,
          category: input.category,
          name: input.newName,
        });

        await ctx.eventRepo.updateByTag(
          input.householdId,
          input.category,
          input.name,
          input.newName
        );

        return {
          id: input.id,
          householdId: input.householdId,
          category: input.category,
          name: input.newName,
        };
      });

      return updatedTag;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {
      const tag = await ctx.tagRepo.getTagById(input.id);

      if (!tag) {
        throw new TagNotFoundError();
      }

      if (!ctx.userHouseholds.includes(tag.householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const deleted = await ctx.unitOfWork.execute(async (repos: Repositories) => {
        const deletedTags = await repos.tagRepo.delete(input.id);

        await ctx.eventRepo.deleteByTag(tag.householdId, tag.category, tag.name);

        return deletedTags;
      });
      return deleted;
    }),
});
