import { initDb } from './_db';

export async function onRequestGet(context: any) {
  await initDb(context.env);
  const { results } = await context.env.DB.prepare("SELECT * FROM announcements").all();
  const mapped = results.map((r: any) => ({
    ...r,
    isActive: r.isActive === undefined ? true : (r.isActive === 1 || r.isActive === true || r.isActive === '1')
  }));
  return Response.json(mapped);
}

export async function onRequestPost(context: any) {
  await initDb(context.env);
  const announcements = await context.request.json();
  
  const stmts = [context.env.DB.prepare("DELETE FROM announcements")];
  for (const a of announcements) {
    stmts.push(
      context.env.DB.prepare("INSERT INTO announcements (id, date, content, color, isActive) VALUES (?, ?, ?, ?, ?)")
        .bind(a.id, a.date, a.content, a.color, a.isActive === false ? 0 : 1)
    );
  }
  await context.env.DB.batch(stmts);
  
  return Response.json({ success: true });
}
