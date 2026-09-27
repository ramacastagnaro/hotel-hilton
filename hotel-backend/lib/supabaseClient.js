// Single Supabase client for the backend, initialized with the service role
// key. Replaces the previous `db.js` module.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '../config/env.js';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    '❌ ERROR: Faltan las variables de entorno de Supabase (SUPABASE_URL o SUPABASE_SERVICE_KEY).'
  );
  throw new Error(
    'Credenciales de Supabase no encontradas. Verifica tu archivo .env'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('✅ Cliente de Supabase inicializado y conectado.');
