// Central environment configuration. Every module reads configuration from
// here instead of touching `process.env` directly, so defaults and parsing live
// in a single place.
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 4000;

// Supabase (service role) credentials.
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Auth rollout switch. Default OFF (spec AUTH-5): the API must stay reachable
// during the migration and no one gets locked out by accident.
export const REQUIRE_AUTH = process.env.REQUIRE_AUTH === 'true';

// Comma-separated list of browser origins allowed to call the API.
export const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Path to the Firebase Admin service account JSON.
export const FIREBASE_ADMIN_KEY_PATH =
  process.env.FIREBASE_ADMIN_KEY_PATH || './firebase-admin-key.json';

// Mercado Pago Checkout Pro credentials. `MP_ACCESS_TOKEN` is a SECRET
// (a production `APP_USR-...` token): it is provided by the host environment
// (e.g. Render) and is never committed to the repository.
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// Public frontend origin used to build the Mercado Pago `back_urls`.
export const FRONTEND_URL = (
  process.env.FRONTEND_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

// Public API origin used to build the Mercado Pago `notification_url`
// (webhook). Optional: the payments controller falls back to the incoming
// request origin when it is unset (fine for local development).
export const BACKEND_URL = (process.env.BACKEND_URL || '').replace(/\/+$/, '');
