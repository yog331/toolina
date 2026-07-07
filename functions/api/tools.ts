import { initDb } from './_db';

export async function onRequestGet(context: any) {
  await initDb(context.env);
  const { results } = await context.env.DB.prepare("SELECT * FROM tools").all();
  const tools = results.map((t: any) => ({...t, isNew: !!t.isNew, isOffline: !!t.isOffline}));
  return Response.json(tools);
}

export async function onRequestPost(context: any) {
  await initDb(context.env);
  const tools = await context.request.json();
  
  const stmts = [context.env.DB.prepare("DELETE FROM tools")];
  for (const t of tools) {
    stmts.push(
      context.env.DB.prepare("INSERT INTO tools (id, name, description, icon, category, path, isNew, isOffline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(t.id, t.name, t.description, t.icon, t.category, t.path, t.isNew ? 1 : 0, t.isOffline ? 1 : 0)
    );
  }
  await context.env.DB.batch(stmts);
  
  return Response.json({ success: true });
}
