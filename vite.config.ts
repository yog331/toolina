import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

// Mock API Plugin to simulate Cloudflare Pages Functions locally
const mockCloudflareApi = () => ({
  name: 'mock-cloudflare-api',
  configureServer(server: any) {
    const DB_FILE = path.resolve(process.cwd(), 'local_d1_mock.json');
    
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url?.startsWith('/api/')) {
        const url = req.url.split('?')[0];
        res.setHeader('Content-Type', 'application/json');
        
        let db: any = { tools: [], feedback: [], announcements: [], settings: { da_rate: 50 } };
        if (fs.existsSync(DB_FILE)) {
          try {
            db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
          } catch (e) {
            console.error("Failed to read mock DB");
          }
        }
        const saveDb = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

        let body = '';
        if (req.method === 'POST') {
          if (req.body) {
            body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          } else {
            await new Promise(resolve => {
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', resolve);
            });
          }
        }

        let parsedBody: any = null;
        if (body) {
          try { 
            parsedBody = JSON.parse(body); 
          } catch (e) { 
            console.error("Mock API JSON Parse Error:", e); 
          }
        }

        if (url === '/api/tools') {
          if (req.method === 'GET') return res.end(JSON.stringify(db.tools));
          if (req.method === 'POST' && parsedBody) { db.tools = parsedBody; saveDb(); return res.end(JSON.stringify({success: true})); }
        }
        if (url === '/api/feedback') {
          if (req.method === 'GET') return res.end(JSON.stringify(db.feedback));
          if (req.method === 'POST' && parsedBody) { db.feedback = parsedBody; saveDb(); return res.end(JSON.stringify({success: true})); }
        }
        if (url === '/api/announcements') {
          if (req.method === 'GET') return res.end(JSON.stringify(db.announcements));
          if (req.method === 'POST' && parsedBody) { db.announcements = parsedBody; saveDb(); return res.end(JSON.stringify({success: true})); }
        }
        if (url === '/api/settings') {
          if (req.method === 'GET') return res.end(JSON.stringify(db.settings));
          if (req.method === 'POST' && parsedBody) { 
            db.settings.da_rate = parsedBody.da_rate; 
            saveDb(); 
            return res.end(JSON.stringify({success: true})); 
          }
        }
        
        if (url === '/api/proxy') {
          const targetUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
          if (!targetUrl) return res.end(JSON.stringify({error: 'URL parameter required'}));
          try {
            const fetchRes = await fetch(targetUrl, {
               headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            const text = await fetchRes.text();
            res.setHeader('Content-Type', fetchRes.headers.get('content-type') || 'application/xml');
            return res.end(text);
          } catch(e: any) {
            return res.end(JSON.stringify({error: e.message}));
          }
        }
        
        return res.end(JSON.stringify({error: 'Not found or invalid request'}));
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss(), mockCloudflareApi()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
