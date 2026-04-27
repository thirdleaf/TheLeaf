import { sql } from "../src/index.js";

async function test() {
  console.log("Discovery: Checking table schema via RAW Neon client...");
  try {
    // The 'sql' export in index.ts is the neon(url) client
    const res = await (sql as any)`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    console.log("Columns in 'users' table:");
    console.table(res);

    const tables = await (sql as any)`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in DB:");
    console.table(tables);

  } catch (err: any) {
    console.error("RAW DISCOVERY FAILED!");
    console.error("Error Message:", err.message);
  }
}

test().then(() => process.exit(0)).catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
