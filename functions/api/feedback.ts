import { initDb } from './_db';

export async function onRequestGet(context: any) {
  await initDb(context.env);
  const { results } = await context.env.DB.prepare("SELECT * FROM feedback").all();
  return Response.json(results);
}

function validateFeedback(f: any): string | null {
  if (!f || typeof f !== 'object') {
    return 'Invalid data payload.';
  }

  const name = typeof f.user === 'string' ? f.user.trim() : '';
  const email = typeof f.email === 'string' ? f.email.trim() : '';
  const mobile = typeof f.mobile === 'string' ? f.mobile.trim() : '';
  const message = typeof f.message === 'string' ? f.message.trim() : '';

  if (!name) {
    return 'Full name is required.';
  }
  if (name.length < 2 || name.length > 100) {
    return 'Full name must be between 2 and 100 characters.';
  }
  if (!/^[a-zA-ZÀ-ÿ\s.'’-]+$/.test(name)) {
    return 'Full name can only contain letters, spaces, and basic punctuation.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email address is required.';
  }
  if (email.length > 100) {
    return 'Email address cannot exceed 100 characters.';
  }
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }

  if (mobile) {
    if (mobile.length < 7 || mobile.length > 20) {
      return 'Mobile number must be between 7 and 20 characters.';
    }
    if (!/^\+?[0-9\s\-()]+$/.test(mobile)) {
      return 'Please enter a valid mobile number format.';
    }
  }

  if (!message) {
    return 'Message body is required.';
  }
  if (message.length < 10 || message.length > 5000) {
    return 'Message must be between 10 and 5000 characters.';
  }

  return null;
}

export async function onRequestPost(context: any) {
  await initDb(context.env);

  let f: any;
  try {
    f = await context.request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Identify admin request by verifying their admin key
  const adminKey = context.request.headers.get('X-Admin-Key');
  const expectedKey = context.env.VITE_ADMIN_PASSWORD || 'admin';
  const isAdmin = adminKey === expectedKey;

  if (!isAdmin) {
    // Verify Turnstile Token if secret key is present (or use test secret key)
    const turnstileToken = context.request.headers.get('X-Turnstile-Token');
    const secretKey = context.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000AA';

    if (turnstileToken) {
      try {
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const body = new URLSearchParams({
          secret: secretKey,
          response: turnstileToken,
        });

        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });

        const verifyResult = await verifyResponse.json() as { success: boolean; 'error-codes'?: string[] };
        if (!verifyResult.success) {
          return new Response(JSON.stringify({ error: 'Anti-bot verification failed. Please try again.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (err) {
        console.error('Turnstile verification request failed:', err);
      }
    } else if (context.env.TURNSTILE_SECRET_KEY && context.env.TURNSTILE_SECRET_KEY !== '1x00000000000000000000000000000000AA') {
      return new Response(JSON.stringify({ error: 'Security verification token is missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Single contact form submission (No reading or leaking other user feedback!)
  const err = validateFeedback(f);
  if (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare("INSERT INTO feedback (id, user, email, subject, message, type, date, status, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(
      f.id || Date.now().toString(), 
      f.user.trim(), 
      f.email.trim(), 
      f.subject || f.type || 'General Inquiry', 
      f.message.trim(), 
      f.type || 'general', 
      f.date || new Date().toISOString().split('T')[0], 
      f.status || 'New', 
      f.mobile ? f.mobile.trim() : ''
    )
    .run();
  
  return Response.json({ success: true });
}

export async function onRequestPut(context: any) {
  await initDb(context.env);

  const adminKey = context.request.headers.get('X-Admin-Key');
  const expectedKey = context.env.VITE_ADMIN_PASSWORD || 'admin';
  if (adminKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized admin action.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let f: any;
  try {
    f = await context.request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!f || !f.id) {
    return new Response(JSON.stringify({ error: 'Feedback ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const err = validateFeedback(f);
  if (err) {
    return new Response(JSON.stringify({ error: `Validation failed: ${err}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare("UPDATE feedback SET status = ?, user = ?, email = ?, subject = ?, message = ?, type = ?, date = ?, mobile = ? WHERE id = ?")
    .bind(
      f.status || 'New',
      f.user.trim(),
      f.email.trim(),
      f.subject || f.type || 'General Inquiry',
      f.message.trim(),
      f.type || 'general',
      f.date,
      f.mobile ? f.mobile.trim() : '',
      f.id
    )
    .run();

  return Response.json({ success: true });
}

export async function onRequestDelete(context: any) {
  await initDb(context.env);

  const adminKey = context.request.headers.get('X-Admin-Key');
  const expectedKey = context.env.VITE_ADMIN_PASSWORD || 'admin';
  if (adminKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized admin action.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const clear = url.searchParams.get('clear');

  if (clear === 'resolved') {
    await context.env.DB.prepare("DELETE FROM feedback WHERE status = 'Resolved'").run();
    return Response.json({ success: true });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: 'Feedback ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare("DELETE FROM feedback WHERE id = ?")
    .bind(id)
    .run();

  return Response.json({ success: true });
}
