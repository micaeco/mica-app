import { Tag } from "@domain/entities/tag";

export interface TagRepository {
  create(tag: Omit<Tag, "id">): Promise<Tag>;

  exists(householdId: string, category: string, name: string): Promise<boolean>;

  getTagById(id: number): Promise<Tag | null>;

  getTagsByCategory(householdId: string, category: string): Promise<Tag[]>;

  update(tag: Tag): Promise<Tag>;

  delete(id: number): Promise<boolean>;
}
