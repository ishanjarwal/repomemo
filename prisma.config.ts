import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

const path =
  process.env.NODE_ENV === "development"
    ? ".env.development"
    : ".env.production";

config({ path });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
