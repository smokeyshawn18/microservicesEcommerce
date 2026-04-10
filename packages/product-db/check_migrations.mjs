import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM "_prisma_migrations" ORDER BY started_at DESC LIMIT 10`
    );
    console.log("Prisma migrations:", result.rows);
  } catch (e1) {
    console.log("_prisma_migrations table not found");
  }

  try {
    const result = await pool.query(
      `SELECT * FROM "drizzle"."__drizzle_migrations" ORDER BY created DESC LIMIT 10 OFFSET 0`
    );
    console.log("Drizzle migrations:", result.rows);
  } catch (e2) {
    console.log("Drizzle migrations table not found");
  }

  try {
    const result = await pool.query(
      `SELECT * FROM "__drizzle_migrations" ORDER BY created DESC LIMIT 10`
    );
    console.log("Drizzle migrations (public schema):", result.rows);
  } catch (e3) {
    console.log("Drizzle migrations (public) not found");
  }

  process.exit(0);
})();
