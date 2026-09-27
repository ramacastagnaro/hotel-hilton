// Operators domain service. Never selects or returns `password_hash` or the
// Firebase UID (spec OPER-1): every query uses an explicit safe column list.
import { firebaseAdmin } from '../lib/firebaseAdmin.js';
import { supabase } from '../lib/supabaseClient.js';
import { badRequest, HttpError, notFound } from '../utils/envelope.js';
import { pickFields, requireFields } from '../utils/validate.js';

// Public operator shape — no secrets, no UID.
const OPERATOR_SELECT = 'operator_id, full_name, email, role, created_at';

// Editable operator fields.
const OPERATOR_UPDATE_FIELDS = ['full_name', 'email', 'role'];

export async function listOperators() {
  const { data, error } = await supabase
    .from('operators')
    .select(OPERATOR_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Resolve an operator (and therefore its role) from a verified token email.
 * Returns `null` when the email is not registered as an operator.
 */
export async function findOperatorByEmail(email) {
  if (!email) return null;

  const { data, error } = await supabase
    .from('operators')
    .select('operator_id, full_name, email, role')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createOperator(body) {
  const { full_name, email, password, role } = body || {};
  requireFields({ full_name, email, password, role }, [
    'full_name',
    'email',
    'password',
    'role',
  ]);

  let firebaseUser;
  try {
    firebaseUser = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: full_name,
    });
  } catch (firebaseError) {
    throw new HttpError(
      500,
      'Error al crear usuario en Firebase: ' + firebaseError.message
    );
  }

  const { data, error } = await supabase
    .from('operators')
    .insert([{ full_name, email, role, firebase_uid: firebaseUser.uid }])
    .select(OPERATOR_SELECT)
    .single();

  if (error) {
    // Roll back the Firebase user so both systems stay consistent.
    await firebaseAdmin
      .auth()
      .deleteUser(firebaseUser.uid)
      .catch(() => {});
    throw error;
  }

  return data;
}

export async function updateOperator(operatorId, body) {
  const payload = pickFields(body, OPERATOR_UPDATE_FIELDS);

  if (Object.keys(payload).length === 0) {
    throw badRequest('No hay campos válidos para actualizar');
  }

  const { data, error } = await supabase
    .from('operators')
    .update(payload)
    .eq('operator_id', operatorId)
    .select(OPERATOR_SELECT);

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Operador no encontrado');
  return data[0];
}

export async function deleteOperator(operatorId) {
  const { data: operator, error } = await supabase
    .from('operators')
    .select('operator_id, email')
    .eq('operator_id', operatorId)
    .maybeSingle();

  if (error) throw error;
  if (!operator) throw notFound('Operador no encontrado');

  const { error: deleteError } = await supabase
    .from('operators')
    .delete()
    .eq('operator_id', operatorId);

  if (deleteError) throw deleteError;

  // Remove the matching Firebase user by email (avoids reading the UID column).
  if (operator.email) {
    try {
      const firebaseUser = await firebaseAdmin
        .auth()
        .getUserByEmail(operator.email);
      await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
    } catch (firebaseError) {
      console.warn(
        '⚠️ No se pudo eliminar de Firebase:',
        firebaseError.message
      );
    }
  }

  return { message: 'Operador eliminado correctamente' };
}
