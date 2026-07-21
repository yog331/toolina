import { initDb } from './_db';

// Static Configuration & In-memory cache for da_rate
let cachedDaRate: number | null = null;
const STATIC_DA_RATE = 60; // Default static configuration value

export async function onRequestGet(context: any) {
  // 1. Check if defined in Environment Variables first (bypasses DB hit)
  if (context.env && context.env.DA_RATE) {
    const envRate = Number(context.env.DA_RATE);
    if (!isNaN(envRate)) {
      return Response.json({ da_rate: envRate });
    }
  }

  // 2. If we have a cached value in memory, return it to prevent DB hit
  if (cachedDaRate !== null) {
    return Response.json({ da_rate: cachedDaRate });
  }

  try {
    await initDb(context.env);
    const { results } = await context.env.DB.prepare("SELECT value FROM settings WHERE key = 'da_rate'").all();
    
    // Fall back to STATIC_DA_RATE if not present in DB
    const da_rate = results.length > 0 ? Number(results[0].value) : STATIC_DA_RATE;
    cachedDaRate = da_rate; // Cache the value in memory
    
    return Response.json({ da_rate });
  } catch (error) {
    console.error('Error fetching da_rate from DB, falling back to static config:', error);
    return Response.json({ da_rate: STATIC_DA_RATE });
  }
}

export async function onRequestPost(context: any) {
  try {
    await initDb(context.env);
    const { da_rate } = await context.request.json();
    await context.env.DB.prepare("INSERT INTO settings (key, value) VALUES ('da_rate', ?) ON CONFLICT(key) DO UPDATE SET value = ?")
      .bind(da_rate.toString(), da_rate.toString()).run();
    
    // Invalidate/update the in-memory cache
    cachedDaRate = Number(da_rate);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
