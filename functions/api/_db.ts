export async function initDb(env: any) {
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS tools (id TEXT PRIMARY KEY, name TEXT, description TEXT, icon TEXT, category TEXT, path TEXT, isNew BOOLEAN, isOffline BOOLEAN);
    CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, user TEXT, email TEXT, subject TEXT, message TEXT, type TEXT, date TEXT, status TEXT);
    CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, date TEXT, content TEXT, color TEXT, isActive BOOLEAN);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS tool_ratings (toolId TEXT PRIMARY KEY, totalScore REAL, count INTEGER);
  `);

  // Migration: Add new columns if the table was created before the schema update
  // We use try/catch because these will throw an error if the columns already exist
  try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN email TEXT;"); } catch (e) {}
  try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN message TEXT;"); } catch (e) {}
  try { await env.DB.exec("ALTER TABLE feedback ADD COLUMN type TEXT;"); } catch (e) {}
  try { await env.DB.exec("ALTER TABLE announcements ADD COLUMN isActive BOOLEAN DEFAULT 1;"); } catch (e) {}
}
