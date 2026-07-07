import { initDb } from './_db';

export async function onRequestGet(context: any) {
  try {
    await initDb(context.env);
    const url = new URL(context.request.url);
    const toolId = url.searchParams.get('toolId');
    if (!toolId) {
      return new Response('Missing toolId', { status: 400 });
    }

    const { results } = await context.env.DB.prepare('SELECT totalScore, count FROM tool_ratings WHERE toolId = ?').bind(toolId).all();
    const result = results[0];
    
    if (!result) {
      return Response.json({ rating: null, count: 0 });
    }

    const rating = Number((result.totalScore / result.count).toFixed(1));
    return Response.json({ rating, count: result.count });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  try {
    await initDb(context.env);
    const { toolId, ratingValue } = await context.request.json();
    if (!toolId || typeof ratingValue !== 'number' || ratingValue < 1 || ratingValue > 5) {
      return new Response('Invalid request', { status: 400 });
    }

    await context.env.DB.prepare(`
      INSERT INTO tool_ratings (toolId, totalScore, count)
      VALUES (?, ?, 1)
      ON CONFLICT (toolId) DO UPDATE SET 
        totalScore = totalScore + excluded.totalScore,
        count = count + 1
    `).bind(toolId, ratingValue).run();

    const { results } = await context.env.DB.prepare('SELECT totalScore, count FROM tool_ratings WHERE toolId = ?').bind(toolId).all();
    const result = results[0];
    const newRating = Number((result.totalScore / result.count).toFixed(1));

    return Response.json({ rating: newRating, count: result.count });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
