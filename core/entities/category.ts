import { z } from "zod";

export const CategoryType = z.enum([
  "sink",
  "shower",
  "toilet",
  "dishwasher",
  "washer",
  "irrigation",
  "pool",
  "leak",
  "other",
  "unknown",
  "rest",
]);

export type CategoryType = z.infer<typeof CategoryType>;

export const Category = z.object({
  type: CategoryType,
  icon: z.string(),
  color: z.string(),
});

export type Category = z.infer<typeof Category>;

export const categories: Category[] = [
  {
    type: "sink",
    icon: "/icons/sink.webp",
    color: "chart-1",
  },
  {
    type: "shower",
    icon: "/icons/shower.webp",
    color: "chart-2",
  },
  {
    type: "toilet",
    icon: "/icons/toilet.webp",
    color: "chart-3",
  },
  {
    type: "dishwasher",
    icon: "/icons/dishwasher.webp",
    color: "chart-4",
  },
  {
    type: "washer",
    icon: "/icons/washer.webp",
    color: "chart-5",
  },
  {
    type: "irrigation",
    icon: "/icons/irrigation.webp",
    color: "chart-1",
  },
  {
    type: "pool",
    icon: "/icons/pool.webp",
    color: "chart-2",
  },
  {
    type: "leak",
    icon: "/icons/leak.webp",
    color: "chart-3",
  },
  {
    type: "other",
    icon: "/icons/other.webp",
    color: "chart-4",
  },
  {
    type: "unknown",
    icon: "/icons/unknown.webp",
    color: "chart-5",
  },
  {
    type: "rest",
    icon: "/icons/rest.webp",
    color: "muted-foreground",
  },
];
