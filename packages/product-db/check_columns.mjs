import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'categories'
      ORDER BY ordinal_position;
    `);
    if (result.rows.length === 0) {
      console.log("✗ categories table does not exist");
    } else {
      console.log("✓ categories columns:");
      result.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}${r.is_nullable === 'NO' ? ' NOT NULL' : ''}`));
    }
  } catch (err) {
    console.error("Error querying categories:", err.message);
  }
  process.exit(0);
})();
