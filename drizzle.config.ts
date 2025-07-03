import path from "path";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: path.resolve(__dirname, ".env.development.local") });

export default defineConfig({
  schema: "./src/infrastructure/db/schema/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
