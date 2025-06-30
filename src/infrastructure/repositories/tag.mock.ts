import { Tag } from "@domain/entities/tag";
import { TagRepository } from "@domain/repositories/tag";

export class MockTagRepository implements TagRepository {
  private mockLabels: Tag[] = [
    {
      id: 1,
      name: "nens",
      category: "shower",
      householdId: "1",
    },
    {
      id: 2,
      name: "pares",
      category: "shower",
      householdId: "1",
    },
    {
      id: 3,
      name: "eco",
      category: "washer",
      householdId: "1",
    },
    {
      id: 4,
      name: "normal",
      category: "washer",
      householdId: "1",
    },
    {
      id: 5,
      name: "sport",
      category: "washer",
      householdId: "1",
    },
    {
      id: 6,
      name: "eco",
      category: "dishwasher",
      householdId: "1",
    },
    {
      id: 7,
      name: "normal",
      category: "dishwasher",
      householdId: "1",
    },
  ];

  async create(tag: Tag): Promise<Tag> {
    this.mockLabels.push(tag);
    return tag;
  }

  async exists(householdId: string, category: string, name: string): Promise<boolean> {
    return this.mockLabels.some(
      (t) => t.householdId === householdId && t.category === category && t.name === name
    );
  }

  async getTagById(id: number): Promise<Tag | null> {
    const tag = this.mockLabels.find((t) => t.id === id);
    return tag || null;
  }

  async getTagsByCategory(householdId: string, category: string): Promise<Tag[]> {
    return this.mockLabels.filter(
      (tag) => tag.householdId === householdId && tag.category === category
    );
  }

  async update(tag: Tag): Promise<Tag> {
    const index = this.mockLabels.findIndex((t) => t.id === tag.id);
    if (index !== -1) {
      this.mockLabels[index] = tag;
      return tag;
    }
    throw new Error("Tag not found");
  }

  async delete(id: number): Promise<boolean> {
    const index = this.mockLabels.findIndex((tag) => tag.id === id);
    if (index !== -1) {
      this.mockLabels.splice(index, 1);
      return true;
    }
    return false;
  }
}
