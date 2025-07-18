import { and, eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { Category } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";
import { TagRepository } from "@domain/repositories/tag";
import { DbType } from "@infrastructure/db";
import { Tag as TagTable, tag as tagTable } from "@infrastructure/db/schema/app/tag";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export function mapTagFromSchema(schema: TagTable): Tag {
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
      .insert(tagTable)
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
      .from(tagTable)
      .where(
        and(
          eq(tagTable.householdId, householdId),
          eq(tagTable.category, category),
          eq(tagTable.name, name)
        )
      )
      .limit(1);

    return existingTag.length > 0;
  }

  async getTagById(id: number): Promise<Tag | null> {
    const tag = await this.db.select().from(tagTable).where(eq(tagTable.id, id)).limit(1);

    return tag.length > 0 ? mapTagFromSchema(tag[0]) : null;
  }

  async getTagsByCategory(householdId: string, category: string): Promise<Tag[]> {
    const tags = await this.db
      .select()
      .from(tagTable)
      .where(and(eq(tagTable.householdId, householdId), eq(tagTable.category, category)));

    return tags.map(mapTagFromSchema);
  }

  async update(tag: Tag): Promise<Tag> {
    const [updatedTag] = await this.db
      .update(tagTable)
      .set({
        name: tag.name,
        category: tag.category,
      })
      .where(eq(tagTable.id, tag.id))
      .returning();

    return mapTagFromSchema(updatedTag);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(tagTable).where(eq(tagTable.id, id)).returning();

    return result.length > 0;
  }
}
