import { neon } from "@neondatabase/serverless";

async function test() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    return;
  }

  console.log("Discovery: RAW NEON CLIENT (No internal imports)...");
  try {
    const sql = neon(databaseUrl);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in public schema:");
    console.table(tables);

    // 2. Check if a specific user exists
    const userId = "user_3CW9BWdM9ZXdj2RkXwVYPutUPO7";
    const user = await sql`SELECT id FROM users WHERE clerk_id = ${userId}`;
    console.log(`User query result for ${userId}:`, user);

  } catch (err: any) {
    console.error("RAW NEON FAILED!");
    console.error("Error Message:", err.message);
  }
}

test().then(() => process.exit(0));
