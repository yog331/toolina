import { initDb } from './_db';

export async function onRequestGet(context: any) {
  await initDb(context.env);
  const { results } = await context.env.DB.prepare("SELECT value FROM settings WHERE key = 'da_rate'").all();
  return Response.json({ da_rate: results.length > 0 ? Number(results[0].value) : 50 });
}

export async function onRequestPost(context: any) {
  await initDb(context.env);
  const { da_rate } = await context.request.json();
  await context.env.DB.prepare("INSERT INTO settings (key, value) VALUES ('da_rate', ?) ON CONFLICT(key) DO UPDATE SET value = ?")
    .bind(da_rate.toString(), da_rate.toString()).run();
  return Response.json({ success: true });
}
