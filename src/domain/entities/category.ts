import { z } from "zod";

export const categories = [
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
] as const;

export const Category = z.enum(categories);

export type Category = z.infer<typeof Category>;

export const CategoryMetadata = z.object({
  icon: z.string().optional(),
  color: z.string(),
});

export type CategoryMetadata = z.infer<typeof CategoryMetadata>;

export const categoryMap: Record<Category, CategoryMetadata> = {
  sink: {
    icon: "/icons/sink.webp",
    color: "chart-1",
  },
  shower: {
    icon: "/icons/shower.webp",
    color: "chart-2",
  },
  toilet: {
    icon: "/icons/toilet.webp",
    color: "chart-3",
  },
  dishwasher: {
    icon: "/icons/dishwasher.webp",
    color: "chart-4",
  },
  washer: {
    icon: "/icons/washer.webp",
    color: "chart-5",
  },
  irrigation: {
    icon: "/icons/irrigation.webp",
    color: "chart-1",
  },
  pool: {
    icon: "/icons/pool.webp",
    color: "chart-2",
  },
  leak: {
    icon: "/icons/leak.webp",
    color: "chart-3",
  },
  other: {
    icon: "/icons/other.webp",
    color: "chart-4",
  },
  unknown: {
    icon: "/icons/unknown.webp",
    color: "chart-5",
  },
  rest: {
    color: "muted-foreground",
  },
};
