import { initDb } from './_db';

export async function onRequestGet(context: any) {
  await initDb(context.env);
  const { results } = await context.env.DB.prepare("SELECT * FROM feedback").all();
  return Response.json(results);
}

export async function onRequestPost(context: any) {
  await initDb(context.env);
  const feedback = await context.request.json();
  
  const stmts = [context.env.DB.prepare("DELETE FROM feedback")];
  for (const f of feedback) {
    stmts.push(
      context.env.DB.prepare("INSERT INTO feedback (id, user, email, subject, message, type, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(f.id, f.user, f.email || '', f.subject || f.type || 'General Inquiry', f.message || '', f.type || 'general', f.date, f.status)
    );
  }
  await context.env.DB.batch(stmts);
  
  return Response.json({ success: true });
}
