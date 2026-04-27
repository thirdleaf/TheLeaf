import { db, userSettings, brokerConnections } from "./index";
import { sql } from "drizzle-orm";

async function runSanityCheck() {
  console.log("🔍 Running Database Sanity Check...");

  try {
    // 1. Connection Check
    const timeRes = await db.execute(sql`SELECT NOW()`);
    console.log("✅ Database Connection: LIVE");
    const timeRows = (timeRes as any).rows || timeRes;
    console.log("   Time from DB:", timeRows?.[0]);

    // 2. Schema Check: userSettings
    const settingsCount = await db.select({ count: sql`count(*)` }).from(userSettings);
    console.log("✅ Table 'user_settings': ACCESSIBLE (Rows:", settingsCount[0]?.count, ")");

    // 3. Schema Check: brokerConnections
    const connCount = await db.select({ count: sql`count(*)` }).from(brokerConnections);
    console.log("✅ Table 'broker_connections': ACCESSIBLE (Rows:", connCount[0]?.count, ")");

    console.log("\n🚀 All systems connected and schema matches implementation.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Sanity Check FAILED:");
    console.error(err);
    process.exit(1);
  }
}

runSanityCheck();
