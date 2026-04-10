import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    // Try to insert
    const result = await pool.query(
      `INSERT INTO "categories" ("name", "slug") VALUES ($1, $2) RETURNING "id", "name", "slug"`,
      ["Men", "mens-fashion"],
    );
    console.log("✓ Insert succeeded:", result.rows[0]);
  } catch (err) {
    console.error("✗ Insert failed:", err.message);
    console.error("Code:", err.code);
  }
  process.exit(0);
})();
