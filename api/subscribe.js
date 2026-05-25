const DEFAULT_SUPABASE_URL = 'https://rxsjhikbmvstsivrqqyg.supabase.co';
const DEFAULT_SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4c2poaWtibXZzdHNpdnJxcXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTI1MDYsImV4cCI6MjA4NzI4ODUwNn0.Wt1i-HBRzX6eF0EzSPHbRLoh6wVKDFMGQqqUyiVdKbo';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function getConfig() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, ''),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON,
    subscribersTable: process.env.SUBSCRIBERS_TABLE || 'website_subscribers',
  };
}

async function readError(response) {
  try {
    const data = await response.json();
    return data?.message || data?.error || response.statusText;
  } catch {
    return response.statusText;
  }
}

async function upsertSubscriber({ config, payload }) {
  const response = await fetch(
    `${config.supabaseUrl}/rest/v1/${config.subscribersTable}?on_conflict=email`,
    {
      method: 'POST',
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response;
}

async function forwardToEdgeFunction({ config, email }) {
  const response = await fetch(`${config.supabaseUrl}/functions/v1/subscribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response;
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export default async function subscribeHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req.body);
  const email = normalizeEmail(body.email);

  if (!EMAIL_PATTERN.test(email)) {
    sendJson(res, 400, { success: false, error: 'Invalid email' });
    return;
  }

  const config = getConfig();
  const payload = {
    email,
    source: 'unwindcode.ai',
  };

  try {
    if (config.serviceKey) {
      await upsertSubscriber({ config, payload });
      sendJson(res, 200, {
        success: true,
        stored: true,
        email,
        destination: 'supabase-rest',
      });
      return;
    }

    await forwardToEdgeFunction({ config, email });
    sendJson(res, 200, {
      success: true,
      stored: true,
      email,
      destination: 'supabase-edge-function',
    });
  } catch (error) {
    sendJson(res, 502, {
      success: false,
      error: 'Unable to store subscriber email',
      detail: error.message,
    });
  }
}
