import { Tag } from "@core/entities/tag";
import { TagRepository } from "@core/repositories/tag";

export class MockTagRepository implements TagRepository {
  private mockLabels: Tag[] = [
    {
      name: "nens",
      category: "shower",
      householdId: "1",
    },
    {
      name: "pares",
      category: "shower",
      householdId: "1",
    },
    {
      name: "eco",
      category: "washer",
      householdId: "1",
    },
    {
      name: "normal",
      category: "washer",
      householdId: "1",
    },
    {
      name: "sport",
      category: "washer",
      householdId: "1",
    },
    {
      name: "eco",
      category: "dishwasher",
      householdId: "1",
    },
    {
      name: "normal",
      category: "dishwasher",
      householdId: "1",
    },
  ];

  async create(tag: Tag): Promise<Tag> {
    this.mockLabels.push(tag);
    return tag;
  }

  async getHouseholdTags(householdId: string): Promise<Tag[]> {
    return this.mockLabels.filter((tag) => tag.householdId === householdId);
  }
}
