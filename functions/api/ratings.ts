import { initDb } from './_db';

interface RatingCacheEntry {
  rating: number | null;
  count: number;
  timestamp: number;
}

// In-memory cache for tool ratings
const ratingsCache: Record<string, RatingCacheEntry> = {};
const CACHE_TTL = 5 * 60 * 1000; // Cache for 5 minutes

export async function onRequestGet(context: any) {
  try {
    const url = new URL(context.request.url);
    const toolId = url.searchParams.get('toolId');
    if (!toolId) {
      return new Response('Missing toolId', { status: 400 });
    }

    // 1. Check in-memory cache first to avoid DB hits
    const cached = ratingsCache[toolId];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return Response.json({ rating: cached.rating, count: cached.count });
    }

    await initDb(context.env);
    const { results } = await context.env.DB.prepare('SELECT totalScore, count FROM tool_ratings WHERE toolId = ?').bind(toolId).all();
    const result = results[0];
    
    if (!result) {
      const emptyEntry = { rating: null, count: 0, timestamp: Date.now() };
      ratingsCache[toolId] = emptyEntry;
      return Response.json({ rating: null, count: 0 });
    }

    const rating = Number((result.totalScore / result.count).toFixed(1));
    
    // Save to in-memory cache
    ratingsCache[toolId] = { rating, count: result.count, timestamp: Date.now() };
    
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

    // Update the in-memory cache immediately to ensure subsequent GET requests get the fresh rating
    ratingsCache[toolId] = { rating: newRating, count: result.count, timestamp: Date.now() };

    return Response.json({ rating: newRating, count: result.count });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
