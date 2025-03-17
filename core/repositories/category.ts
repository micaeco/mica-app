import "server-only";

import { Category } from "@core/entities/category";

export interface CategoryRepository {
  getCategories(): Category[];
}
