import "server-only";

import { Category } from "@core/entities/category";
import { CategoryRepository } from "@core/repositories/category";

export class MockCategoryRepository implements CategoryRepository {
  getCategories(): Category[] {
    return [
      {
        id: "1",
        icon: "/icons/sink.webp",
        type: "sink",
        color: "chart-1",
      },
      {
        id: "2",
        icon: "/icons/dishwasher.webp",
        type: "dishwasher",
        color: "chart-2",
        labels: [
          {
            householdId: "1",
            categoryId: "4",
            name: "eco",
          },
        ],
      },
      {
        id: "3",
        icon: "/icons/washer.webp",
        type: "washer",
        color: "chart-3",
        labels: [
          {
            householdId: "1",
            categoryId: "4",
            name: "eco",
          },
          {
            householdId: "1",
            categoryId: "4",
            name: "rapida",
          },
          {
            householdId: "1",
            categoryId: "4",
            name: "llana",
          },
          {
            householdId: "1",
            categoryId: "4",
            name: "sport",
          },
        ],
      },
      {
        id: "4",
        icon: "/icons/shower.webp",
        type: "shower",
        color: "chart-4",
        labels: [
          {
            householdId: "1",
            categoryId: "4",
            name: "nens",
          },
          {
            householdId: "1",
            categoryId: "4",
            name: "pares",
          },
        ],
      },
      {
        id: "5",
        icon: "/icons/toilet.webp",
        type: "toilet",
        color: "chart-5",
      },
      {
        id: "6",
        icon: "/icons/irrigation.webp",
        type: "irrigation",
        color: "chart-2",
      },
      {
        id: "7",
        icon: "/icons/leak.webp",
        type: "leak",
        color: "chart-3",
      },
      {
        id: "8",
        icon: "/icons/unknown.webp",
        type: "unknown",
        color: "chart-4",
      },
      {
        id: "9",
        icon: "/icons/other.webp",
        type: "other",
        color: "chart-5",
      },
    ];
  }
}
