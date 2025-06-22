import { eq } from "drizzle-orm";
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

  async getHouseholdTags(householdId: string): Promise<Tag[]> {
    const tags = await this.db
      .select()
      .from(tagSchema)
      .where(eq(tagSchema.householdId, householdId));

    return tags.map(mapTagFromSchema);
  }
}
