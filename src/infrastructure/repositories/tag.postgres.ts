import { and, eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { Category } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";
import { TagRepository } from "@domain/repositories/tag";
import { DbType } from "@infrastructure/db/db";
import { TagSchema, tagSchema } from "@infrastructure/db/schema/tag";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export function mapTagFromSchema(schema: TagSchema): Tag {
  return {
    id: schema.id,
    householdId: schema.householdId,
    name: schema.name,
    category: schema.category as Category,
  };
}

export class PostgresTagRepository implements TagRepository {
  constructor(private db: DbType | DrizzleTx) {}

  async create(tag: Tag): Promise<Tag> {
    const [newTag] = await this.db
      .insert(tagSchema)
      .values({
        householdId: tag.householdId,
        name: tag.name,
        category: tag.category,
      })
      .returning();

    return mapTagFromSchema(newTag);
  }

  async exists(householdId: string, category: Category, name: string): Promise<boolean> {
    const existingTag = await this.db
      .select()
      .from(tagSchema)
      .where(
        and(
          eq(tagSchema.householdId, householdId),
          eq(tagSchema.category, category),
          eq(tagSchema.name, name)
        )
      )
      .limit(1);

    return existingTag.length > 0;
  }

  async getTagById(id: number): Promise<Tag | null> {
    const tag = await this.db.select().from(tagSchema).where(eq(tagSchema.id, id)).limit(1);

    return tag.length > 0 ? mapTagFromSchema(tag[0]) : null;
  }

  async getTagsByCategory(householdId: string, category: string): Promise<Tag[]> {
    const tags = await this.db
      .select()
      .from(tagSchema)
      .where(and(eq(tagSchema.householdId, householdId), eq(tagSchema.category, category)));

    return tags.map(mapTagFromSchema);
  }

  async update(tag: Tag): Promise<Tag> {
    const [updatedTag] = await this.db
      .update(tagSchema)
      .set({
        name: tag.name,
        category: tag.category,
      })
      .where(eq(tagSchema.id, tag.id))
      .returning();

    return mapTagFromSchema(updatedTag);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(tagSchema).where(eq(tagSchema.id, id)).returning();

    return result.length > 0;
  }
}
