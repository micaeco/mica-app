import { Tag } from "@domain/entities/tag";

export interface TagRepository {
  create(tag: Tag): Promise<Tag>;

  getHouseholdTags(householdId: string): Promise<Tag[]>;
}
