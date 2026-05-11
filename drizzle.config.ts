import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local", quiet: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    get url() {
      const url = process.env["DATABASE_URL"];
      if (!url) throw new Error("DATABASE_URL environment variable is not set");
      return url;
    },
  },
});
