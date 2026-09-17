/**
 * Switches Prisma provider based on DATABASE_URL.
 *
 * - If DATABASE_URL starts with "postgresql://" or "postgres://" → provider = "postgresql"
 * - Otherwise (file:./... or sqlite) → provider = "sqlite"
 *
 * Run automatically before `prisma generate` via the postinstall hook.
 * This lets the same codebase run on SQLite locally and Postgres in
 * production without manually editing schema.prisma.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";

let provider = "sqlite";
if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  provider = "postgresql";
}

const schema = fs.readFileSync(schemaPath, "utf8");
const updated = schema.replace(
  /datasource db \{\s*provider\s*=\s*"[^"]+"/,
  `datasource db {\n  provider = "${provider}"`
);

if (schema !== updated) {
  fs.writeFileSync(schemaPath, updated);
  console.log(`▸ Prisma provider set to "${provider}" based on DATABASE_URL`);
} else {
  console.log(`▸ Prisma provider already "${provider}" (no change)`);
}
