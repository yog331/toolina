let dbInitPromise: Promise<void> | null = null;

export async function initDb(env: any) {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      // Automatic DDL execution has been disabled per user request.
      // You can manually run these queries in your Wrangler/D1 console or local DB.
      /*
      await env.DB.exec(`
        CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, user TEXT, email TEXT, subject TEXT, message TEXT, type TEXT, date TEXT, status TEXT);
        CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, date TEXT, content TEXT, color TEXT, isActive BOOLEAN);
        CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
        CREATE TABLE IF NOT EXISTS tool_ratings (toolId TEXT PRIMARY KEY, totalScore REAL, count INTEGER);
      `);

      try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN email TEXT;"); } catch (e) {}
      try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN message TEXT;"); } catch (e) {}
      try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN type TEXT;"); } catch (e) {}
      try { await env.DB.exec("ALTER TABLE announcements ADD COLUMN isActive BOOLEAN DEFAULT 1;"); } catch (e) {}
      */
    })();
  }
  return dbInitPromise;
}
