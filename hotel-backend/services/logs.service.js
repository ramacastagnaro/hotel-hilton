// System logs domain service. Canonical columns are
// (log_id, event_type, description, user_email, created_at).
import { supabase } from '../lib/supabaseClient.js';
import { requireFields } from '../utils/validate.js';

const LOG_SELECT = 'log_id, event_type, description, user_email, created_at';

export async function listLogs() {
  const { data, error } = await supabase
    .from('system_logs')
    .select(LOG_SELECT)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function createLog(body) {
  const { event_type, description, user_email } = body || {};
  requireFields({ event_type, description }, ['event_type', 'description']);

  const { data, error } = await supabase
    .from('system_logs')
    .insert([{ event_type, description, user_email: user_email || null }])
    .select(LOG_SELECT)
    .single();

  if (error) throw error;
  return data;
}
