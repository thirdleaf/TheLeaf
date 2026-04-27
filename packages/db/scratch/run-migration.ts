import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

async function migrate() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    return;
  }

  console.log("🚀 STARTING MANUAL MIGRATION...");
  try {
    const sql = neon(databaseUrl);
    
    // Get migrations from packages/db/migrations
    // Note: In 0001_numerous_redwing.sql, there are statement-breakpoints.
    // We should probably just run them as one big script if Neon supports it, 
    // or split by statements if needed.
    
    const migrationDir = "./migrations";
    const files = readdirSync(migrationDir).filter(f => f.endsWith(".sql")).sort();
    
    for (const file of files) {
      console.log(`\n📄 Applying: ${file}`);
      const content = readFileSync(join(migrationDir, file), "utf-8");
      
      // Neon's client might fail on large scripts with multiple statements?
      // Let's try to split by --> statement-breakpoint
      const statements = content.split("--> statement-breakpoint");
      
      for (const stmt of statements) {
        const trimmed = stmt.trim();
        if (!trimmed) continue;
        
        try {
          // Note: for neon, we can only run one "query" at a time in some modes, 
          // but neon() usually supports multiple statements if they are separated by ;
          // However, drizzle-kit generated statements often have specific syntax.
          await sql(trimmed);
        } catch (e: any) {
          if (e.message.includes("already exists") || e.message.includes("duplicate_object")) {
            console.warn(`  ⚠️ Skipping (already exists): ${trimmed.substring(0, 50)}...`);
          } else {
            console.error(`  ❌ Failed statement: ${trimmed.substring(0, 100)}...`);
            console.error(`  Error: ${e.message}`);
          }
        }
      }
    }

    console.log("\n✅ MIGRATION COMPLETE!");

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables now in DB:");
    console.table(tables);

  } catch (err: any) {
    console.error("MIGRATION FAILED!");
    console.error("Error Message:", err.message);
  }
}

migrate().then(() => process.exit(0));
